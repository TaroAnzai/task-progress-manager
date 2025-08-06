// src/components/task/TaskCard.tsx

import { useState } from 'react';
import type { Task } from '@/api/generated/taskProgressAPI.schemas';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import TaskHeader from './TaskHeader';
import ObjectiveTable from './ObjectiveTable';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem(`objective_visibility_${task.id}`);
    return stored ? JSON.parse(stored) : true;
  });

  const toggleVisibility = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(`objective_visibility_${task.id}`, JSON.stringify(newState));
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm">
      <div className="flex items-start justify-between px-4 py-2 border-b">
        <TaskHeader task={task} />
        <button
          onClick={toggleVisibility}
          className="text-sm text-blue-600 hover:underline"
        >
          {isExpanded ? '－' : '＋'}
        </button>
      </div>
      {isExpanded && (
        <div className="px-4 py-2">
          <ObjectiveTable taskId={task.id} />
        </div>
      )}
    </div>
  );
}
