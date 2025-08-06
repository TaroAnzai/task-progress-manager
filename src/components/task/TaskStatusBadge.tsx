// src/components/task/TaskStatusBadge.tsx

import type { Task } from '@/api/generated/taskProgressAPI.schemas';
import { useTasks } from '@/context/TaskContext';
//import { showTaskStatusSelector } from '@/lib/status_ui';

interface TaskStatusBadgeProps {
  task: Task;
}

export default function TaskStatusBadge({ task }: TaskStatusBadgeProps) {
  const { tasks } = useTasks();
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
    <>  </>
/*     <span
      className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium status-${task.status_id} cursor-pointer`}
      onClick={handleClick}
    >
      <span className="mr-1 block h-2 w-2 rounded-full bg-current" />
      {getStatusLabel(task.status_id)}
    </span> */
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
