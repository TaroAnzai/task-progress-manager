// src/components/task/TaskHeader.tsx

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

import type { Task } from '@/api/generated/taskProgressAPI.schemas';
import { useUser } from '@/context/useUser';

import TaskSettingsIcon from './TaskSettingsIcon';
import TaskStatusBadge from './TaskStatusBadge';



interface TaskHeaderProps {
  task: Task;
}

export default function TaskHeader({ task }: TaskHeaderProps) {
  const { user } = useUser();
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
        <TaskStatusBadge task={task} />
      </div>
      <div className="shrink-0">
        <TaskSettingsIcon task={task} user={user} />
      </div>
    </div>
  );
}
