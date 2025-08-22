// src/components/task/TaskHeader.tsx

import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

import { getGetProgressTasksTaskIdQueryOptions, usePutProgressTasksTaskId } from "@/api/generated/taskProgressAPI";
import type { Task, TaskUpdateStatus as TaskUpdateStatusType } from '@/api/generated/taskProgressAPI.schemas';
import { TaskUpdateStatus } from "@/api/generated/taskProgressAPI.schemas";

import { useAlertDialog } from '@/context/useAlertDialog';
import { useTasks } from '@/context/useTasks';
import { useUser } from '@/context/useUser';

import { StatusBadgeCell } from "./StatusBadgeCell";
import { TaskSettingsIcon } from './TaskSettingsIcon';

interface TaskHeaderProps {
  task: Task;
}


export const TaskHeader = ({ task }: TaskHeaderProps) => {
  const qc = useQueryClient();
  const { user } = useUser();
  const { refetch: refetchTasks, can } = useTasks();
  const { openAlertDialog } = useAlertDialog();
  const [status, setStatus] = useState<TaskUpdateStatusType>(task.status ?? TaskUpdateStatus.UNDEFINED);
  const [isUpdateTask, setIsUpdateTask] = useState(false);
  const { mutate: updateTask } = usePutProgressTasksTaskId({
    mutation: {
      onMutate: (variables) => {
        if (variables.data.status) setStatus(variables.data.status);
        const prevStatus = status;
        return { prevStatus }
      },
      onSuccess: (_data, variables) => {
        toast.success("タスクを更新しました");
        refetchTasks();
        setStatus(status);
        //     if (variables.data.status === TaskUpdateStatus.SAVED) {
        const { queryKey } = getGetProgressTasksTaskIdQueryOptions(task.id);
        qc.invalidateQueries({ queryKey });
        //   }
      },
      onError: (error, _variables, context) => {
        openAlertDialog({
          title: "Error",
          description: error,
          confirmText: "閉じる",
          showCancel: false
        })
        if (!context?.prevStatus) return
        setStatus(context.prevStatus);
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

  useEffect(() => {
    setIsUpdateTask(can("task.update", task))
  }, [can, task])


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
          disabled={!isUpdateTask}
        />
      </div>
      {isUpdateTask ? (
        <div className="shrink-0">
          <TaskSettingsIcon task={task} user={user} />
        </div>
      ) : (
        <div className="w-[36px]"></div>
      )}

    </div>
  );
};

