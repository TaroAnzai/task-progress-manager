// src/components/task/ObjectiveTable.tsx
import { useEffect, useState } from 'react';

import { toast } from "sonner";

import { Skeleton } from '@/components/ui/skeleton';
import {
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useGetProgressObjectivesTasksTaskId, usePostProgressObjectives, usePostProgressTasksTaskIdObjectivesOrder, usePutProgressObjectivesObjectiveId } from '@/api/generated/taskProgressAPI';
import type { Objective, ObjectiveInput, ObjectiveUpdate } from '@/api/generated/taskProgressAPI.schemas';

import {DraggableRow,DraggableTable,DraggableTableBody} from "@/components/DraggableTable";

import { extractErrorMessage } from "@/utils/errorHandler";

import { useUser } from '@/context/useUser';

import { ObjectiveRow } from "./objective/ObjectiveRow";
interface ObjectiveTableProps {
  taskId: number;
}

export const ObjectiveTable = ({ taskId }: ObjectiveTableProps) => {
  const { user } = useUser();

  const { data, isLoading, refetch: refetchObjectives } = useGetProgressObjectivesTasksTaskId(taskId);
  const postObjective = usePostProgressObjectives();
  const updateObjective = usePutProgressObjectivesObjectiveId();

  const [objectives, setObjectives] = useState<Objective[]>([]);

  const { mutate: postObjectivesOrderMutation } = usePostProgressTasksTaskIdObjectivesOrder(
    {
      mutation: {
        onSuccess: () => {
          toast.success("順序を更新しました");
          refetchObjectives();
        },
        onError: (e) => {
          const err = extractErrorMessage(e);
          toast.error("順序更新に失敗しました", { description: err });
          refetchObjectives();//登録失敗時に元の並びに戻す
        },
      }
    }
  );

  useEffect(() => {
    if (data) {
      setObjectives(data.objectives ?? []);
    }
  }, [data]);
  if (!user) return;
  // ObjectiveTable内に追加：新規登録関数
  const handleSaveNew = async (obj: ObjectiveInput) => {
    if (!obj.title || !obj.title.trim()) {
      console.warn("タイトルが入力されていません");
      return;
    }

    try {
      await postObjective.mutateAsync({
        data: {
          title: obj.title.trim(),
          due_date: obj.due_date ?? null,
          assigned_user_id: obj.assigned_user_id ?? user.id,
          task_id: taskId, // propsから渡されている
        },
      });

      // 登録後に再フェッチ（React Queryのキャッシュ更新）
      refetchObjectives();
      toast.success("Objectiveを登録しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error("Objective登録失敗:", err);
      toast.error("Objective登録に失敗しました", { description: err });
    }
  };

  const handleUpdate = async (objId: number, updates: ObjectiveUpdate) => {
    if (!objId) {
      console.warn("無効なIDです");
      return;
    }

    // 空文字だけのタイトルは保存させない（任意）
    if (typeof updates.title === "string" && updates.title.trim() === "") {
      console.warn("タイトルが空文字のため更新しません");
      return;
    }
    try {
      await updateObjective.mutateAsync({
        objectiveId: objId,
        data: updates,
      });

      // 更新後に再フェッチ（React Queryのキャッシュ更新）
      refetchObjectives();
      toast.success("Objectiveを更新しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error(`Objective ID ${objId} の更新に失敗しました`, e);
      toast.error("Objective更新に失敗しました", { description: err });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }


  // ドロップ
  const handleRender = (newObj: Objective[]) => {
    const newObjectives = newObj.map((o)=>o.id);
    setObjectives(newObj);
     postObjectivesOrderMutation({ taskId: taskId, data: { order: newObjectives } });
  };

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }


  return (
    <div className="overflow-x-auto">
      <DraggableTable
          items={objectives}
          getId={(item) => item.id}
          useGrabHandle = {true}
          onReorder={handleRender}
          className="min-w-full text-sm text-left"
      >
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="px-3 py-2">オブジェクティブ</TableHead>
            <TableHead className="px-3 py-2">期限</TableHead>
            <TableHead className="px-3 py-2">ステータス</TableHead>
            <TableHead className="px-3 py-2">担当者</TableHead>
            <TableHead className="px-3 py-2">進捗</TableHead>
            <TableHead className="px-3 py-2">報告日</TableHead>
            <TableHead className="px-3 py-2">履歴</TableHead>
          </TableRow>
        </TableHeader>
        <DraggableTableBody>
          {objectives.map((obj) => (
            <DraggableRow key={obj.id} id={obj.id}>
              <ObjectiveRow
                taskId={taskId}
                objective={obj}
                onSaveNew={handleSaveNew}
                onUpdate={handleUpdate}
              />
            </DraggableRow>
          ))}

          {/* 常に表示される新規入力行 */}
          <TableRow>
            <ObjectiveRow
              key="new"
              taskId={taskId}
              objective={null}
              onSaveNew={handleSaveNew}
              onUpdate={handleUpdate}
            />
          </TableRow>
        </DraggableTableBody>
      </DraggableTable>
    </div>
  );
};

