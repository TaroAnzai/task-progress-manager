// src/components/task/ObjectiveTable.tsx
import { useEffect, useState } from 'react';

import {toast} from "sonner"

import { useGetProgressObjectivesTasksTaskId, usePutProgressObjectivesObjectiveId  } from '@/api/generated/taskProgressAPI';
import { usePostProgressObjectives } from "@/api/generated/taskProgressAPI";
import type {  ObjectiveInput,  ObjectiveUpdate} from '@/api/generated/taskProgressAPI.schemas';
import type {Objective} from "@/api/generated/taskProgressAPI.schemas";
import { Skeleton } from '@/components/ui/skeleton';
import { extractErrorMessage } from "@/utils/errorHandler";

import { ObjectiveRow } from "./objective/ObjectiveRow";

interface ObjectiveTableProps {
  taskId: number;
}

export default function ObjectiveTable({ taskId }: ObjectiveTableProps) {
  const { data, isLoading, refetch: refetchObjectives } = useGetProgressObjectivesTasksTaskId(taskId);
  const postObjective = usePostProgressObjectives();
  const updateObjective = usePutProgressObjectivesObjectiveId();

  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    if (data) {
      setObjectives(data.objectives??[]);
    }
  }, [data]);

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
          assigned_user_id: obj.assigned_user_id ?? null,
          task_id: taskId, // propsから渡されている
        },
      });

      // 登録後に再フェッチ（React Queryのキャッシュ更新）
      refetchObjectives();
      toast.success("Objectiveを登録しました");
    } catch (e) {
      const err = extractErrorMessage(e);
      console.error("Objective登録失敗:", err);
      toast.error("Objective登録に失敗しました", {description: err});
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
      toast.error("Objective更新に失敗しました", {description: err});
    }
  };

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">オブジェクティブ</th>
            <th className="px-3 py-2">期限</th>
            <th className="px-3 py-2">ステータス</th>
            <th className="px-3 py-2">担当者</th>
            <th className="px-3 py-2">進捗</th>
            <th className="px-3 py-2">報告日</th>
            <th className="px-3 py-2">履歴</th>
          </tr>
        </thead>
          <tbody>
            {objectives.map((obj, idx) => (
              <ObjectiveRow
                key={obj.id}
                taskId= {taskId}
                objective={obj}
                index={idx}
                onSaveNew={handleSaveNew}
                onUpdate={handleUpdate}
              />
            ))}

            {/* 常に表示される新規入力行 */}
            <ObjectiveRow
              key={`new-${objectives.length}`}  
              taskId = {taskId}
              objective={null}
              index={objectives.length}
              onSaveNew={handleSaveNew}
              onUpdate={handleUpdate}
            />
          </tbody>
      </table>
    </div>
  );
}
