//src\components\task\taskSettingOrderModal\TaskOrderSettingModal.tsx

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TableCell } from '@/components/ui/table';

import {
  getGetProgressTasksQueryOptions,
  useDeleteProgressTasksTaskId,
  usePostProgressTaskOrders,
  usePutProgressTasksTaskId,
} from '@/api/generated/taskProgressAPI';
import type {
  Task,
  TaskListResponse,
  TaskUpdateStatus,
} from '@/api/generated/taskProgressAPI.schemas';

import { DraggableRow, DraggableTable, DraggableTableBody } from '@/components/DraggableTable';

import { SCOPE_LABELS } from '@/context/roleLabels';
import { useTasks } from '@/context/useTasks';
import { useUser } from '@/context/useUser';

import { StatusBadgeCell } from '../StatusBadgeCell';
interface TaskSettingModalProps {
  open: boolean;
  onClose: () => void;
}

export const TaskOrderSettingModal = ({ open, onClose }: TaskSettingModalProps) => {
  const qc = useQueryClient();
  const { tasks, can } = useTasks();
  const { user } = useUser();

  // 並び替え
  const { mutate: postProgressTaskOrders } = usePostProgressTaskOrders({
    mutation: {
      onMutate: (variables) => {
        const prevTasks = tasks ?? [];
        if (variables.data.task_ids) {
          const newOrder = variables.data.task_ids;
          const newTasks = prevTasks
            .slice()
            .sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));

          const { queryKey } = getGetProgressTasksQueryOptions();
          qc.setQueryData(queryKey, newTasks as TaskListResponse);
        }
        return { prevTasks };
      },
      onSuccess: () => {
        toast.success('順序を更新しました');
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.prevTasks) {
          const { queryKey } = getGetProgressTasksQueryOptions();
          qc.setQueryData(queryKey, ctx.prevTasks as TaskListResponse);
        }
      },
    },
  });

  // ステータス変更
  const { mutate: updateTask } = usePutProgressTasksTaskId({
    mutation: {
      onMutate: (variables) => {
        const prevTasks = tasks ?? [];
        const { taskId, data } = variables;
        const newTasks = prevTasks.map((t) => (t.id === taskId ? { ...t, ...data } : t));

        const { queryKey } = getGetProgressTasksQueryOptions();
        qc.setQueryData(queryKey, newTasks as TaskListResponse);
        return { prevTasks };
      },
      onSuccess: () => {
        toast.success('タスクを更新しました');
        const { queryKey } = getGetProgressTasksQueryOptions();
        qc.invalidateQueries({ queryKey });
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.prevTasks) {
          const { queryKey } = getGetProgressTasksQueryOptions();
          qc.setQueryData(queryKey, ctx.prevTasks as TaskListResponse);
        }
      },
    },
  });

  // 削除
  const { mutate: deleteProgressTasksTaskId } = useDeleteProgressTasksTaskId({
    mutation: {
      onMutate: (variables) => {
        const prevTasks = tasks ?? [];
        const newTasks = prevTasks.filter((t) => t.id !== variables.taskId);

        const { queryKey } = getGetProgressTasksQueryOptions();
        qc.setQueryData(queryKey, newTasks as TaskListResponse);
        return { prevTasks };
      },
      onSuccess: () => {
        toast.success('タスクを削除しました');
        const { queryKey } = getGetProgressTasksQueryOptions();
        qc.invalidateQueries({ queryKey });
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.prevTasks) {
          const { queryKey } = getGetProgressTasksQueryOptions();
          qc.setQueryData(queryKey, ctx.prevTasks as TaskListResponse);
        }
      },
    },
  });

  const handleUpdateTaskStatus = (task_id: number, status: TaskUpdateStatus) => {
    const payload = {
      status: status,
    };
    updateTask({ taskId: task_id, data: payload });
  };

  const handleRender = (items: Task[]) => {
    if (!user) return;
    const newTasksArray = items.map((task) => task.id);
    postProgressTaskOrders({ data: { task_ids: newTasksArray, user_id: user.id } });
  };

  const handleDerete = (id: number) => {
    deleteProgressTasksTaskId({ taskId: id });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>タスクの並び替え・削除 </DialogTitle>
          <DialogDescription> ドラッグしてタスク並び替・削除ボタンで削除 </DialogDescription>
        </DialogHeader>

        <DraggableTable
          items={tasks ?? []}
          getId={(item) => item.id}
          useGrabHandle={true}
          onReorder={(newItems) => {
            if (!user) return;
            handleRender(newItems);
          }}
        >
          <DraggableTableBody>
            {tasks?.map((task) => (
              <DraggableRow key={task.id} id={task.id}>
                <TableCell className="max-w-xs truncate">{task.title}</TableCell>
                <TableCell>{task.create_user_name}</TableCell>
                <TableCell className="text-center">{task.due_date}</TableCell>
                <TableCell className="text-center">
                  <StatusBadgeCell
                    value={task.status ?? 'UNDEFINED'}
                    onChange={(newStatus) => handleUpdateTaskStatus(task.id, newStatus)}
                    disabled={!can('task.update', task)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  {task.user_access_level ? SCOPE_LABELS[task.user_access_level] : ''}
                </TableCell>
                <TableCell className="text-center">
                  {can('task.delete', task) && (
                    <Button variant="destructive" size="sm" onClick={() => handleDerete(task.id)}>
                      削除
                    </Button>
                  )}
                </TableCell>
              </DraggableRow>
            ))}
          </DraggableTableBody>
        </DraggableTable>

        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
