import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getGetProgressTasksQueryOptions,
  getGetProgressTasksTaskIdQueryOptions,
  useGetProgressTasks,
  usePutProgressTasksTaskId,
} from '@/api/generated/taskProgressAPI';
import type {
  Objective,
  Task,
  TaskListResponse,
  TaskUpdate,
} from '@/api/generated/taskProgressAPI.schemas';

import { can as rawCan, type LevelResolver } from '@/acl/can';
import type { AccessLevel, Action } from '@/acl/policy';
import { useAlertDialog } from '@/context/useAlertDialog';
import { useUser } from '@/context/useUser';

import { TaskContext } from './TaskContextBase';
type Subject = Task | Objective | { taskId: number };
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const qc = useQueryClient();
  const { user } = useUser();
  const currentUserId = user?.id;
  const [isLoading, setIsLoading] = useState(true);
  const { openAlertDialog } = useAlertDialog();
  const {
    data,
    isLoading: loading,
    isFetching,
    refetch,
  } = useGetProgressTasks<TaskListResponse>({
    query: { enabled: !!user?.id }, // ログイン後に実行
  });
  const tasks = useMemo(() => data?.tasks ?? [], [data]);

  const updateTask = (taskId: number, data: TaskUpdate) => {
    _updateTask({ taskId: taskId, data: data });
  };
  const { mutate: _updateTask } = usePutProgressTasksTaskId({
    mutation: {
      onMutate: async (variables) => {
        const queryKeyTasks = getGetProgressTasksQueryOptions().queryKey;
        const queryKeyTask = getGetProgressTasksTaskIdQueryOptions(variables.taskId).queryKey;
        const prevTasks = qc.getQueryData(queryKeyTasks);
        const prevTask = qc.getQueryData(queryKeyTask);
        // 楽観的更新
        qc.setQueryData<Task>(queryKeyTask, (old) => (old ? { ...old, ...variables.data } : old));

        qc.setQueryData<TaskListResponse | undefined>(queryKeyTasks, (old) => {
          if (!old || !old.tasks) return old;
          return {
            ...old,
            tasks: old.tasks.map((t) =>
              t.id === variables.taskId ? { ...t, ...variables.data } : t
            ),
          };
        });

        return { prevTask, prevTasks };
      },
      onError: (err, vars, context) => {
        if (context?.prevTasks) {
          const queryKeyTasks = getGetProgressTasksQueryOptions().queryKey;
          qc.setQueryData(queryKeyTasks, context.prevTasks);
        }
        if (context?.prevTask) {
          const queryKeyTask = getGetProgressTasksTaskIdQueryOptions(vars.taskId).queryKey;
          qc.setQueryData(queryKeyTask, context.prevTask);
        }
        openAlertDialog({
          title: 'タスク更新に失敗しました',
          description: err,
          confirmText: '閉じる',
          showCancel: false,
        });
      },
      onSuccess: () => {
        toast.success('ステータスを更新しました');
      },
      onSettled: () => {},
    },
  });

  useEffect(() => {
    setIsLoading(loading || isFetching || !user?.id);
  }, [loading, isFetching, user?.id]);

  // ユーザーのアクセスレベル用
  const accessMap = useMemo(() => {
    if (!tasks) return new Map<number, AccessLevel>();
    const m = new Map<number, AccessLevel>();
    if (tasks) {
      for (const t of tasks) {
        const lvl = (t as Task).user_access_level as AccessLevel | undefined;
        if (lvl) m.set(Number(t.id), lvl);
      }
    }
    return m;
  }, [tasks]);

  const levelOf: LevelResolver = useCallback(
    (taskId: number) => accessMap.get(taskId),
    [accessMap]
  );
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
    <TaskContext.Provider
      value={{ tasks, isLoading, updateTask, refetch, levelOf, can, getDisabledProps }}
    >
      {children}
    </TaskContext.Provider>
  );
};
