// src/components/task/TaskHeader.tsx
import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

import {
  getGetProgressTasksTaskIdQueryOptions,
  usePutProgressTasksTaskId,
} from '@/api/generated/taskProgressAPI';
import type {
  Task,
  TaskUpdateStatus as TaskUpdateStatusType,
} from '@/api/generated/taskProgressAPI.schemas';

import { useAlertDialog } from '@/context/useAlertDialog';
import { useTasks } from '@/context/useTasks';

import { StatusBadgeCell } from './StatusBadgeCell';
import { TaskSettingsIcon } from './TaskSettingsIcon';

interface TaskHeaderProps {
  task: Task;
}

export const TaskHeader = ({ task }: TaskHeaderProps) => {
  const qc = useQueryClient();
  const { openAlertDialog } = useAlertDialog();
  const { can } = useTasks();
  const [isUpdateTask, setIsUpdateTask] = useState(false);

  const { mutate: updateTask } = usePutProgressTasksTaskId({
    mutation: {
      onMutate: async (variables) => {
        await qc.cancelQueries({ queryKey: ['task', task.id] });
        const prevTask = qc.getQueryData<Task>(['task', task.id]);

        // 楽観的更新
        qc.setQueryData<Task>(['task', task.id], {
          ...task,
          ...variables.data,
        });

        return { prevTask };
      },
      onError: (_err, _vars, context) => {
        if (context?.prevTask) {
          qc.setQueryData(['task', task.id], context.prevTask);
        }
        openAlertDialog({
          title: 'Error',
          description: 'タスク更新に失敗しました',
          confirmText: '閉じる',
          showCancel: false,
        });
      },
      onSuccess: () => {
        toast.success('ステータスを更新しました');
      },
      onSettled: () => {
        const { queryKey } = getGetProgressTasksTaskIdQueryOptions(task.id);
        qc.invalidateQueries({ queryKey });
        qc.invalidateQueries({ queryKey: ['tasks'] });
      },
    },
  });

  const handleUpdateTaskStatus = (status: TaskUpdateStatusType) => {
    updateTask({ taskId: task.id, data: { status } });
  };

  const dueDateStr = task.due_date
    ? format(new Date(task.due_date), 'yyyy年M月d日', { locale: ja })
    : '期限未設定';

  useEffect(() => {
    setIsUpdateTask(can('task.update', task));
  }, [can, task]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-grow">
        <h4 className="md:w-[50%] text-base font-semibold leading-snug text-gray-800 whitespace-pre-wrap">
          {task.title}
        </h4>
        <span className="text-sm text-gray-500 mr-1 flex">
          [作成者:&nbsp;
          <span className="w-[90px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {task.create_user_name}
          </span>
          ]
        </span>
        <span className="w-[150px] text-sm text-gray-500 whitespace-nowrap">
          [期限: {dueDateStr}]
        </span>
        <StatusBadgeCell
          value={task.status ?? 'UNDEFINED'}
          onChange={handleUpdateTaskStatus}
          disabled={!isUpdateTask}
        />
      </div>
      <div className="shrink-0">
        <TaskSettingsIcon task={task} isUpdateTask={isUpdateTask} />
      </div>
    </div>
  );
};
