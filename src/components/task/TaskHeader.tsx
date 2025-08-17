// src/components/task/TaskHeader.tsx

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner';

import {usePutProgressTasksTaskId} from "@/api/generated/taskProgressAPI"
import type { Task, TaskUpdateStatus } from '@/api/generated/taskProgressAPI.schemas';

import { useAlertDialog } from '@/context/useAlertDialog';
import { useUser } from '@/context/useUser';

import {StatusBadgeCell} from "./StatusBadgeCell"
import { TaskSettingsIcon } from './TaskSettingsIcon';
interface TaskHeaderProps {
  task: Task;
}

export const TaskHeader = ({ task }: TaskHeaderProps) => {
  const { user } = useUser();
  const { openAlertDialog } = useAlertDialog();
  const {mutate:updateTask} = usePutProgressTasksTaskId({
    mutation: {
      onSuccess: () => {
        toast.success("タスクを更新しました");
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

  const handleUpdateTaskStatus = (status:TaskUpdateStatus) => {
    const payload = {
      status: status,
    };
    updateTask({taskId:task.id, data:payload});
  };

  const dueDateStr = task.due_date
    ? format(new Date(task.due_date), 'yyyy年M月d日', { locale: ja })
    : '期限未設定';



  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-grow">
        <h4 className="text-base font-semibold leading-snug text-gray-800">
          {task.title}
        </h4>
        <span className="text-sm text-gray-500">[期限: {dueDateStr}]</span>
        <StatusBadgeCell
          value={task.status?task.status:"NOT_STARTED"}
          onChange ={handleUpdateTaskStatus}  
         />
      </div>
      <div className="shrink-0">
        <TaskSettingsIcon task={task} user={user} />
      </div>
    </div>
  );
};

