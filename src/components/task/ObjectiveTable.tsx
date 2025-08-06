// src/components/task/ObjectiveTable.tsx

import { useEffect, useState } from 'react';
import type { Objective } from '@/api/generated/taskProgressAPI.schemas';
import { useUser } from '@/context/UserContext';
import { useGetProgressObjectivesTasksTaskId } from '@/api/generated/taskProgressAPI';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ObjectiveRow } from "./objective/ObjectiveRow";

interface ObjectiveTableProps {
  taskId: number;
}

export default function ObjectiveTable({ taskId }: ObjectiveTableProps) {
  const { user } = useUser();
  const { data, isLoading } = useGetProgressObjectivesTasksTaskId(taskId);

  const objectives = data?.objectives ?? [];
 // ObjectiveTable内に追加：新規登録関数
const handleSaveNew = (obj: Partial<Objective>) => {
  console.log("新規登録:", obj);
  // TODO: usePostProgressObjectives.mutateAsync() などを呼び出す
};

const handleUpdate = (id: number, updates: Partial<Objective>) => {
  console.log("更新:", id, updates);
  // TODO: usePutProgressObjectivesObjectiveId.mutateAsync(id, { data: updates })
};

  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2">#</th>
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
                objective={obj}
                index={idx}
                onSaveNew={handleSaveNew}
                onUpdate={handleUpdate}
              />
            ))}

            {/* 常に表示される新規入力行 */}
            <ObjectiveRow
              key="new"
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

function getStatusLabel(statusId: number): string {
  switch (statusId) {
    case 1:
      return '未着手';
    case 2:
      return '進行中';
    case 3:
      return '完了';
    case 4:
      return '保留';
    default:
      return '不明';
  }
}
