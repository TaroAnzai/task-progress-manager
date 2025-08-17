//src\components\task\taskSettingOrderModal\TaskOrderSettingModal.tsx
import { useEffect,useState } from "react"

import {toast} from "sonner"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {useDeleteProgressTasksTaskId,usePostProgressTaskOrders} from "@/api/generated/taskProgressAPI"
import type { Task } from "@/api/generated/taskProgressAPI.schemas"

import {DraggableRow,DraggableTable,DraggableTableBody} from "@/components/DraggableTable";

import { useAlertDialog } from "@/context/useAlertDialog";
import { useTasks } from "@/context/useTasks"
import {useUser} from "@/context/useUser"

interface TaskSettingModalProps {
    open: boolean;
    onClose: () => void;
}

export const TaskOrderSettingModal = ({ open, onClose }: TaskSettingModalProps) => {
    const { tasks,refetch:refetchTasks } = useTasks();
    const { user } = useUser();
    const {openAlertDialog} = useAlertDialog();
    const [items, setItems] = useState<Task[]>([]);

    useEffect(() => {
      if (tasks) {
        setItems(tasks);
      }
    }, [tasks]);


    const {mutate: postProgressTaskOrders} = usePostProgressTaskOrders({
      mutation:{
        onSuccess: () => {
          toast.success("順序を更新しました");
          refetchTasks();
        },
        onError:(error) => {
          openAlertDialog({
            title: "Error",
            description: error,
            confirmText: "閉じる",
            showCancel: false,
          });
        }
      }
    });
    const {mutate: deleteProgressTasksTaskId} = useDeleteProgressTasksTaskId({
      mutation:{
        onSuccess: () => {
          toast.success("タスクを削除しました");
          refetchTasks();
        },
        onError:(error) => {
          openAlertDialog({
            title: "Error",
            description: error,
            confirmText: "閉じる",
            showCancel: false,
          });
        }
      }
    });



  const handleRender = (items:Task[]) =>{
    setItems(items);
    if (!user)  return
    const newTasksArray = items.map((task) => task.id,)
    postProgressTaskOrders({data:{task_ids:newTasksArray, user_id:user.id}});
  }

  const handleDerete = (id:number) => {
    deleteProgressTasksTaskId({taskId:id});
  }

  return (
      <Dialog open={open} onOpenChange={onClose} >
          <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col" >
              <DialogHeader className="flex-shrink-0" >
                  <DialogTitle>タスクの並び替え・削除 </DialogTitle>
                  < DialogDescription > ドラッグしてタスク並び替・削除ボタンで削除 </DialogDescription>
              </DialogHeader>

                <DraggableTable
                  items={items}
                  getId={(item) => item.id}
                  useGrabHandle = {true}
                  onReorder={handleRender}
                >
                  <TableHeader className="sticky top-0 z-10 bg-white">
                      <TableRow>
                          <TableHead className="w-[100px]">タスク名</TableHead>
                          <TableHead>作成者</TableHead>
                          <TableHead>期限</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>アクセス権限</TableHead>                            
                          <TableHead className="text-right">削除</TableHead>
                      </TableRow>
                  </TableHeader>
                  <DraggableTableBody>
                      {items?.map((task) => (
                          <DraggableRow key={task.id} id={task.id}>
                              <TableCell className="font-medium">{task.title}</TableCell>
                              <TableCell>{task.create_user_name}</TableCell>
                              <TableCell>{task.due_date}</TableCell>
                              <TableCell>{task.status}</TableCell>
                              <TableCell>{task.user_access_level}</TableCell>
                              <TableCell className="text-right">
                                  <Button variant="destructive" size="sm" onClick={() => handleDerete(task.id)}>削除</Button>
                              </TableCell>
                          </DraggableRow>
                      ))
                      }
                  </DraggableTableBody>

              </DraggableTable>

          <DialogFooter>
              <Button onClick={onClose}>閉じる</Button>
          </DialogFooter>
      </DialogContent>
      </Dialog >
  );
};