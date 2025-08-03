import { createContext, useContext, useEffect, useState } from "react";
import {  useGetProgressTasks,} from "@/api/generated/taskProgressAPI";
import type {Task,TaskListResponse} from "@/api/generated/taskProgressAPI.schemas"
import { useUser } from "@/context/UserContext";

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  refetch: () => void;
  setTasks: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    data,
    isLoading:Loading,
    isFetching,
    refetch,
  } = useGetProgressTasks<TaskListResponse>({
    query: {
      enabled: !!user?.id, // ログイン後に実行
    },
  });

  useEffect(() => {
    setIsLoading(Loading || isFetching || !user?.id);
  }, [Loading, isFetching, user?.id]);

  // API取得結果を state に反映
  useEffect(() => {
    if (data?.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, refetch, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
