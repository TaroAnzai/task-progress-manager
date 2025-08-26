import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// ========== 型 ==========
/**
 * APIスキーマ（Orval出力）を使う場合は以下を利用:
 * import { ObjectiveReminderSettingInput } from "@/api/generated/taskProgressAPI.schemas";
 * 今回は提示の型に準拠します。
 */
export type ObjectiveReminderSettingInputConditionType = "NO_UPDATE" | "OVERDUE";
export type ObjectiveReminderSettingInputFrequencyType = "ONCE" | "INTERVAL";

export interface ObjectiveReminderSettingInput {
  condition_type: ObjectiveReminderSettingInputConditionType;
  frequency_type: ObjectiveReminderSettingInputFrequencyType;
  threshold_days?: number | null;
  interval_days?: number | null;
  send_time_local?: string; // "HH:mm" など
  is_active?: boolean;
}

// ========== 定数 ==========
const CONDITION_OPTIONS: ObjectiveReminderSettingInputConditionType[] = [
  "NO_UPDATE",
  "OVERDUE",
];

const FREQUENCY_OPTIONS: ObjectiveReminderSettingInputFrequencyType[] = [
  "ONCE",
  "INTERVAL",
];

// ========== バリデーション(Zod) ==========
// - INTERVAL のとき interval_days を必須(>=1)
// - threshold_days は >=0（0日しきい値を許可。不要なら >=1 に変更）
// - ONCE のとき interval_days は null/未入力扱いに正規化
const schema = z
  .object({
    condition_type: z.enum(["NO_UPDATE", "OVERDUE"]),
    frequency_type: z.enum(["ONCE", "INTERVAL"]),
    threshold_days: z
      .union([z.number().int().min(0), z.null(), z.undefined()])
      .optional(),
    interval_days: z
      .union([z.number().int().min(1), z.null(), z.undefined()])
      .optional(),
    send_time_local: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:mm 形式で入力してください")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    is_active: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.frequency_type === "INTERVAL") {
      if (!val.interval_days || val.interval_days < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["interval_days"],
          message: "繰り返し間隔（日）は1以上で必須です。",
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

// ========== Props ==========
type Props = {
  defaultValues?: Partial<ObjectiveReminderSettingInput>;
  onSubmit: (input: ObjectiveReminderSettingInput) => void | Promise<void>;
  submitting?: boolean;
};

// ========== コンポーネント ==========
export const ObjectiveReminderSettingForm = ({
  defaultValues,
  onSubmit,
  submitting,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition_type: defaultValues?.condition_type ?? "NO_UPDATE",
      frequency_type: defaultValues?.frequency_type ?? "ONCE",
      threshold_days:
        defaultValues?.threshold_days === undefined
          ? 7
          : defaultValues.threshold_days,
      interval_days:
        defaultValues?.interval_days === undefined
          ? null
          : defaultValues.interval_days,
      send_time_local:
        defaultValues?.send_time_local === undefined
          ? "09:00"
          : defaultValues.send_time_local ?? undefined,
      is_active: defaultValues?.is_active ?? true,
    },
    mode: "onBlur",
  });

  const freq = form.watch("frequency_type");
  const cond = form.watch("condition_type");

  const thresholdLabel = useMemo(() => {
    return cond === "NO_UPDATE"
      ? "経過日数（日）: 最終更新からの経過日数"
      : "経過日数（日）: 期限からの経過日数";
  }, [cond]);

  const handleSubmit = (values: FormValues) => {
    // 正規化: ONCE のとき interval_days は null
    const normalized: ObjectiveReminderSettingInput = {
      condition_type: values.condition_type,
      frequency_type: values.frequency_type,
      threshold_days:
        values.threshold_days === undefined ? null : values.threshold_days,
      interval_days:
        values.frequency_type === "INTERVAL"
          ? (values.interval_days ?? null)
          : null,
      send_time_local: values.send_time_local || undefined,
      is_active: values.is_active ?? true,
    };
    return onSubmit(normalized);
  };

  return (
    <Card className='mr-4 p-4'>
      <CardTitle>目標リマインド設定</CardTitle>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 px-6 py-4 w-full"
        >
          {/* 条件設定行 */}
          <div className="grid grid-cols-2 gap-3">
            {/* condition_type */}
            <FormField
              control={form.control}
              name="condition_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">条件タイプ</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v as typeof field.value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === "NO_UPDATE" ? "未更新" : "期限超過"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* threshold_days */}
            <FormField
              control={form.control}
              name="threshold_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">"経過日数（日）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="例: 7"
                      className="h-9"
                      value={
                        field.value === null || field.value === undefined
                          ? ""
                          : field.value
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : Number(v));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 説明テキスト */}
          {/* <div className="text-xs text-muted-foreground space-y-1 px-1">
          <p>{thresholdLabel}</p>
          <p>「未更新」＝最終更新からの経過日を基準</p>
          <p>「期限超過」＝期限を過ぎてからの経過日を基準</p>
          <p>0を指定すると「当日から通知」のような挙動にできます。</p>
        </div> */}

          {/* 頻度設定行 */}
          <div className="grid grid-cols-2 gap-3">
            {/* frequency_type */}
            <FormField
              control={form.control}
              name="frequency_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">頻度</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v as typeof field.value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === "ONCE" ? "1回のみ" : "繰り返し"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* interval_days */}
            <FormField
              control={form.control}
              name="interval_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">繰り返し間隔（日）</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder="例: 3"
                      className="h-9"
                      value={
                        field.value === null || field.value === undefined
                          ? ""
                          : field.value
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : Number(v));
                      }}
                      disabled={form.watch("frequency_type") !== "INTERVAL"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 繰り返し説明 */}
          {/* <div className="text-xs text-muted-foreground px-1">
          <p>「繰り返し」を選んだ場合は間隔日数が必須（1以上）</p>
        </div> */}

          {/* 送信時刻 */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="send_time_local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">送信時刻</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step={60}
                      className="h-9"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {/* 有効/無効切り替え */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem >
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">この設定を有効化</FormLabel>
                      <FormDescription className="text-xs">
                        {/* 無効化するとリマインドは送信されません */}
                      </FormDescription>
                    </div>
                    <div className="h-9 flex items-center justify-center rounded-lg border bg-muted/30">
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>                </FormItem>
                )}
              />
            </div> {/* 右側のスペース確保 */}
          </div>



          {/* 送信ボタン */}
          <div className="flex gap-4 pt-2">
            <Button type='button' >削除</Button>
            <Button type='button' >クリア</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
