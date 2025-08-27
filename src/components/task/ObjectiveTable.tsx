// src/components/task/ObjectiveTable.tsx
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Skeleton } from '@/components/ui/skeleton';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
  getGetProgressObjectivesTasksTaskIdQueryKey,
  useGetProgressObjectivesTasksTaskId,
  usePostProgressObjectives,
  usePostProgressTasksTaskIdObjectivesOrder,
  usePutProgressObjectivesObjectiveId,
} from '@/api/generated/taskProgressAPI';
import type {
  Objective,
  ObjectiveInput,
  ObjectivesList,
  ObjectiveUpdate,
} from '@/api/generated/taskProgressAPI.schemas';
import { ObjectiveStatus } from '@/api/generated/taskProgressAPI.schemas';

import { DraggableRow, DraggableTable, DraggableTableBody } from '@/components/DraggableTable';

import { extractErrorMessage } from '@/utils/errorHandler';

import { useTasks } from '@/context/useTasks';
import { useUser } from '@/context/useUser';

import { ObjectiveRow } from './objective/ObjectiveRow';
interface ObjectiveTableProps {
  taskId: number;
}

export const ObjectiveTable = ({ taskId }: ObjectiveTableProps) => {
  const qc = useQueryClient();
  const { user } = useUser();
  const { can } = useTasks();
  const {
    data,
    isLoading,
    refetch: refetchObjectives,
  } = useGetProgressObjectivesTasksTaskId(taskId);
  const [objectives, setObjectives] = useState<Objective[]>(data?.objectives ?? []);

  useEffect(() => {
    if (data?.objectives) setObjectives(data.objectives);
  }, [data]);

  //新規登録関数
  const { mutate: postObjective } = usePostProgressObjectives({
    mutation: {
      onSuccess: () => {
        toast.success('Objectiveを登録しました');
        refetchObjectives();
      },
      onError: (e) => {
        const err = extractErrorMessage(e);
        console.error('Objective登録失敗:', err);
        toast.error('Objective登録に失敗しました', { description: err });
      },
    },
  });
  const { mutate: updateObjective } = usePutProgressObjectivesObjectiveId({
    mutation: {
      onMutate: async (variables) => {
        await qc.cancelQueries({ queryKey: getGetProgressObjectivesTasksTaskIdQueryKey(taskId) });
        const previousData: ObjectivesList | undefined = qc.getQueryData(
          getGetProgressObjectivesTasksTaskIdQueryKey(taskId)
        );
        if (!previousData?.objectives) return { previousData };
        //楽観的更新
        const optimisticObjective: Objective[] = previousData.objectives.map((obj) =>
          obj.id === variables.objectiveId ? { ...obj, ...variables.data } : obj
        );
        if (!optimisticObjective) return { previousData };
        setObjectives(optimisticObjective);
        qc.setQueryData(getGetProgressObjectivesTasksTaskIdQueryKey(taskId), optimisticObjective);
        return { previousData };
      },
      onSuccess: () => {
        toast.success('Objectiveを更新しました');
        refetchObjectives();
      },
      onError: (e, _vars, context) => {
        const err = extractErrorMessage(e);
        console.error(`Objectiveの更新に失敗しました`, e);
        toast.error('Objective更新に失敗しました', { description: err });
        setObjectives(context?.previousData?.objectives ?? []);
      },
    },
  });

  //オブジェクトの並び登録関数
  const { mutate: postObjectivesOrderMutation } = usePostProgressTasksTaskIdObjectivesOrder({
    mutation: {
      onSuccess: () => {
        toast.success('順序を更新しました');
        refetchObjectives();
      },
      onError: (e) => {
        const err = extractErrorMessage(e);
        toast.error('順序更新に失敗しました', { description: err });
        refetchObjectives(); //登録失敗時に元の並びに戻す
      },
    },
  });
  //早期リターン
  if (!user) return;
  if (isLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  // Objective新規登録関数
  const handleSaveNew = async (obj: ObjectiveInput) => {
    if (!obj.title || !obj.title.trim()) {
      console.warn('タイトルが入力されていません');
      return;
    }
    postObjective({
      data: {
        title: obj.title.trim(),
        due_date: obj.due_date ?? null,
        assigned_user_id: obj.assigned_user_id ?? user.id,
        task_id: taskId,
      },
    });
  };

  //更新用ハンドル関数
  const handleUpdate = async (objId: number, updates: ObjectiveUpdate) => {
    if (!objId) {
      console.warn('無効なIDです');
      return;
    }
    // 空文字だけのタイトルは保存させない（任意）
    if (typeof updates.title === 'string' && updates.title.trim() === '') {
      console.warn('タイトルが空文字のため更新しません');
      return;
    }
    updateObjective({ objectiveId: objId, data: updates });
  };
  // ドロップ時の並べ替え
  const handleRender = (newObj: Objective[]) => {
    const newObjectives = newObj.map((o) => o.id);
    setObjectives(newObj);
    postObjectivesOrderMutation({ taskId: taskId, data: { order: newObjectives } });
  };

  return (
    <div className="overflow-x-auto">
      <DraggableTable
        items={objectives}
        getId={(item) => item.id}
        useGrabHandle={true}
        onReorder={handleRender}
        className="min-w-full text-sm text-left"
      >
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-[400px] px-3 py-2">オブジェクティブ</TableHead>
            <TableHead className="w-[120px] px-3 py-2">期限</TableHead>
            <TableHead className="w-[120px] px-3 py-2">ステータス</TableHead>
            <TableHead className="w-[120px] px-3 py-2">担当者</TableHead>
            <TableHead className="px-3 py-2">進捗</TableHead>
            <TableHead className="w-[100px] px-3 py-2">報告日</TableHead>
            <TableHead className="w-[60px] px-3 py-2">履歴</TableHead>
            <TableHead className="w-[60px] px-3 py-2">Mail</TableHead>
          </TableRow>
        </TableHeader>
        <DraggableTableBody>
          {objectives
            .filter((task) => task.status !== ObjectiveStatus.SAVED)
            .map((obj) => (
              <DraggableRow
                key={obj.id}
                id={obj.id}
                disabled={!can('objective.update', { taskId: taskId })}
              >
                <ObjectiveRow
                  taskId={taskId}
                  objective={obj}
                  onSaveNew={handleSaveNew}
                  onUpdate={handleUpdate}
                />
              </DraggableRow>
            ))}

          {/* 常に表示される新規入力行 */}
          {can('objective.create', { taskId: taskId }) && (
            <TableRow>
              <ObjectiveRow
                key="new"
                taskId={taskId}
                objective={null}
                onSaveNew={handleSaveNew}
                onUpdate={handleUpdate}
              />
            </TableRow>
          )}
        </DraggableTableBody>
      </DraggableTable>
    </div>
  );
};
