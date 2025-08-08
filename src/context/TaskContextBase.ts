import { createContext } from "react";
import type { Task } from "@/api/generated/taskProgressAPI.schemas";

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  refetch: () => void;
  setTasks: (tasks: Task[]) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
