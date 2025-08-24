// src/components/task/TaskList.tsx

import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

import { useTasks } from '@/context/useTasks';

import { TaskCard } from './TaskCard';
import type { FilterAccessLevel } from '@/pages/TaskPage';

interface TaskListProps {
  isExpandParent?: boolean;
  viewMode: Record<FilterAccessLevel, boolean>;
}

export const TaskList = ({ isExpandParent, viewMode }: TaskListProps) => {
  const { tasks } = useTasks();
  // Filter out tasks with status SAVED
  const notSavedTasks = tasks.filter((task) => task.status !== TaskStatus.SAVED);

  // Further filter tasks based on user access level
  const filteredTasks = notSavedTasks.filter(
    (task) =>
      (task.user_access_level && viewMode[task.user_access_level]) ||
      (task.is_assigned && viewMode['ASSIGNED'])
  );

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} taskId={task.id} isExpandParent={isExpandParent} />
      ))}
    </div>
  );
};
