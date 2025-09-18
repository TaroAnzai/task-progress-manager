import { createContext } from 'react';

import type { Objective, Task, TaskUpdate } from '@/api/generated/taskProgressAPI.schemas';

import type { AccessLevel, Action } from '@/acl/policy';
type Subject = Task | Objective | { taskId: number };
export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  updateTask: (taskId: number, data: TaskUpdate) => void;
  refetch: () => void;
  levelOf: (taskId: number) => AccessLevel | undefined;
  can: (Action: Action, subject: Subject) => boolean; // ← 呼ぶ側は user.id 渡さなくてOK
  getDisabledProps: (
    action: Action,
    subject: Subject
  ) => { disabled: boolean; 'aria-disabled': boolean };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
