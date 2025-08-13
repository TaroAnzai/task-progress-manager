// src/components/task/TaskStatusBadge.tsx

import type { Task, TaskStatus as taskStatusType } from '@/api/generated/taskProgressAPI.schemas';
import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

//import { showTaskStatusSelector } from '@/lib/status_ui';

interface TaskStatusBadgeProps {
  task: Task;
}

export const TaskStatusBadge = ({ task }: TaskStatusBadgeProps) => {
  const canEdit = task.user_access_level !== 'view';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    const wrapper = e.currentTarget.closest('.status-badge-wrapper') as HTMLElement;
    if (wrapper) {
      // showTaskStatusSelector(task.id, wrapper, task.status_id);
    }
  };

  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium status-${task.status} cursor-pointer`}
      onClick={handleClick}
    >
      <span className="mr-1 block h-2 w-2 rounded-full bg-current" />
      {getStatusLabel(task.status)}
    </span>
  );
};

const getStatusLabel = (status: taskStatusType | undefined): string => {
  switch (status) {
    case TaskStatus.NOT_STARTED:
      return '未着手';
    case TaskStatus.IN_PROGRESS:
      return '進行中';
    case TaskStatus.COMPLETED:
      return '完了';
    case TaskStatus.SAVED:
      return '保存';
    default:
      return '不明';
  }
};


