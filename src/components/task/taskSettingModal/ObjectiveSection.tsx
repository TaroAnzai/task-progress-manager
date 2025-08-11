// src/components/task/taskSettingModal/ObjectiveSection.tsx

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Objective } from "@/api/generated/taskProgressAPI.schemas";

interface ObjectiveSectionProps {
  taskId: number;
  objectives: Objective[];
  isEditable: boolean;
  onRemoveObjective: (objectiveId: number) => void;
}

export const ObjectiveSection = ({
  objectives,
  isEditable,
  onRemoveObjective,
}: ObjectiveSectionProps) => (
  <div className="mt-6">
    <h3 className="text-base font-semibold mb-2">オブジェクティブ一覧</h3>
    <ul className="space-y-2">
      {objectives.map((obj) => (
        <li
          key={obj.id}
          className="flex items-center justify-between bg-gray-50 border px-3 py-2 rounded"
        >
          <div className="flex-1">
            <p className="font-medium">{obj.title}</p>
            <p className="text-sm text-muted-foreground">締切: {obj.due_date || "-"}</p>
          </div>
          {isEditable && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemoveObjective(obj.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
        </li>
      ))}
      {objectives.length === 0 && (
        <p className="text-sm text-muted-foreground">オブジェクティブはまだ登録されていません。</p>
      )}
    </ul>
  </div>
);
