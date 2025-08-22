// src/components/task/TaskList.tsx

import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

import { useTasks } from '@/context/useTasks';

import { TaskCard } from './TaskCard';

interface TaskListProps {
  isExpandParent?: boolean
}
export const TaskList = ({ isExpandParent }: TaskListProps) => {
  const { tasks } = useTasks();


  return (
    <div className="space-y-4">
      {tasks
        .filter((task) => task.status !== TaskStatus.SAVED)
        .map((task) => (
          <TaskCard key={task.id} taskId={task.id} isExpandParent={isExpandParent} />
        ))}
    </div>
  );
};


