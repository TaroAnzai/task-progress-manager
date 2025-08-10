import { type ReactNode,useEffect, useState } from "react";

import { useGetProgressTasks } from "@/api/generated/taskProgressAPI";
import type { Task, TaskListResponse } from "@/api/generated/taskProgressAPI.schemas";

import { useUser } from "@/context/useUser";

import { TaskContext } from "./TaskContextBase";

export default function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isLoading: loading, isFetching, refetch } =
    useGetProgressTasks<TaskListResponse>({
      query: { enabled: !!user?.id }, // ログイン後に実行
    });

  useEffect(() => {
    setIsLoading(loading || isFetching || !user?.id);
  }, [loading, isFetching, user?.id]);

  useEffect(() => {
    if (data?.tasks) setTasks(data.tasks);
  }, [data]);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, refetch, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}
