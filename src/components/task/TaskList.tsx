// src/components/task/TaskList.tsx



import { Skeleton } from '@/components/ui/skeleton';

import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

import { useTasks } from '@/context/useTasks';

import { TaskCard } from './TaskCard';

export const TaskList = () => {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks
        .filter((task) => task.status !== TaskStatus.SAVED)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};


