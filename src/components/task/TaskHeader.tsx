// src/components/task/TaskHeader.tsx

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

import { getGetProgressTasksQueryOptions, usePutProgressTasksTaskId } from "@/api/generated/taskProgressAPI";
import type { Task, TaskUpdateStatus as TaskUpdateStatusType } from '@/api/generated/taskProgressAPI.schemas';
import { TaskUpdateStatus } from "@/api/generated/taskProgressAPI.schemas";

import { useAlertDialog } from '@/context/useAlertDialog';
import { useUser } from '@/context/useUser';

import { StatusBadgeCell } from "./StatusBadgeCell";
import { TaskSettingsIcon } from './TaskSettingsIcon';

interface TaskHeaderProps {
  task: Task;
}


export const TaskHeader = ({ task }: TaskHeaderProps) => {
  const qc = useQueryClient();
  const { user } = useUser();
  const { openAlertDialog } = useAlertDialog();
  const [status, setStatus] = useState<TaskUpdateStatusType>(task.status ?? TaskUpdateStatus.UNDEFINED);
  const { mutate: updateTask } = usePutProgressTasksTaskId({
    mutation: {
      onSuccess: (_data, variables) => {
        toast.success("タスクを更新しました");
        setStatus(status);
        if (variables.data.status === TaskUpdateStatus.SAVED) {
          const { queryKey } = getGetProgressTasksQueryOptions();
          qc.invalidateQueries({ queryKey });
        }

      },
      onError: (error) => {
        openAlertDialog({
          title: "Error",
          description: error,
          confirmText: "閉じる",
          showCancel: false
        })
      }
    }
  });

  const handleUpdateTaskStatus = (status: TaskUpdateStatusType) => {
    const payload = {
      status: status,
    };
    updateTask({ taskId: task.id, data: payload });
  };

  const dueDateStr = task.due_date
    ? format(new Date(task.due_date), 'yyyy年M月d日', { locale: ja })
    : '期限未設定';



  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-grow">
        <h4 className="md:w-[50%] text-base font-semibold leading-snug text-gray-800">
          {task.title}
        </h4>
        <span className="w-[150px] text-sm text-gray-500 whitespace-nowrap">[期限: {dueDateStr}]</span>
        <StatusBadgeCell
          value={status}
          onChange={handleUpdateTaskStatus}
        />
      </div>
      <div className="shrink-0">
        <TaskSettingsIcon task={task} user={user} />
      </div>
    </div>
  );
};

