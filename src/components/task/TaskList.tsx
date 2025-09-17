// src/components/task/TaskList.tsx

import { ClipLoader } from 'react-spinners';

import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

import { useTasks } from '@/context/useTasks';
import { useUser } from '@/context/useUser';
import type { FilterAccessLevel } from '@/pages/TaskPage';

import { TaskCard } from './TaskCard';

interface TaskListProps {
  isExpandParent?: boolean;
  viewMode: Record<FilterAccessLevel, boolean>;
}

export const TaskList = ({ isExpandParent, viewMode }: TaskListProps) => {
  const { tasks, isLoading } = useTasks();
  const { user } = useUser();
  // Filter out tasks with status SAVED
  const notSavedTasks = tasks.filter((task) => task.status !== TaskStatus.SAVED);

  // Further filter tasks based on user access level
  const filteredTasks = notSavedTasks.filter(
    (task) =>
      (task.user_access_level && viewMode[task.user_access_level]) ||
      (task.created_by === user?.id && viewMode['OWNER']) ||
      (task.has_assigned_objective && viewMode['ASSIGNED'])
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <ClipLoader color="#36d7b7" size={100} />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} taskId={task.id} isExpandParent={isExpandParent} />
      ))}
    </div>
  );
};
