import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { useGetProgressTasks } from "@/api/generated/taskProgressAPI";
import type { Objective, Task, TaskListResponse } from "@/api/generated/taskProgressAPI.schemas";

import { can as rawCan, type LevelResolver } from '@/acl/can';
import type { AccessLevel, Action } from '@/acl/policy';
import { useUser } from "@/context/useUser";

import { TaskContext } from "./TaskContextBase";
type Subject = Task | Objective | { taskId: number }
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const currentUserId = user?.id;
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
  // ユーザーのアクセスレベル用
  const accessMap = useMemo(() => {
    const m = new Map<number, AccessLevel>();
    for (const t of tasks) {
      const lvl = (t as Task).user_access_level as AccessLevel | undefined;
      if (lvl) m.set(Number(t.id), lvl);
    }
    return m;
  }, [tasks]);

  const levelOf: LevelResolver = useCallback((taskId: number) => accessMap.get(taskId), [accessMap]);
  const can = useCallback(
    (action: Action, subject: Subject) => rawCan(action, subject, levelOf, currentUserId),
    [levelOf, currentUserId]
  );
  //{...getDisabledProps('progress.update',obj)}
  const getDisabledProps = useCallback(
    (action: Action, subject: Subject) => {
      const allowed = can(action, subject);
      return { disabled: !allowed, 'aria-disabled': !allowed };
    },
    [can]
  );

  return (
    <TaskContext.Provider value={{ tasks, isLoading, refetch, setTasks, levelOf, can, getDisabledProps }}>
      {children}
    </TaskContext.Provider>
  );
}
