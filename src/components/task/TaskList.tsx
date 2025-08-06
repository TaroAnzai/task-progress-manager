// src/components/task/TaskList.tsx

import { useTasks } from '@/context/TaskContext';
import { useUser } from '@/context/UserContext';
import TaskCard from './TaskCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function TaskList() {
  const { tasks, isLoading } = useTasks();
  const { user } = useUser();

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
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
