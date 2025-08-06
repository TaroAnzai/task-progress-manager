import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {
  usePostProgressTasks,
  usePutProgressTasksTaskId,
} from "@/api/generated/taskProgressAPI";
import type {Task} from "@/api/generated/taskProgressAPI.schemas"
import { useTasks } from "@/context/TaskContext";
import { useUser } from "@/context/UserContext";

interface TaskSettingModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null; // null or undefined => 新規作成モード
}

export default function TaskSettingModal({ open, onClose, task }: TaskSettingModalProps) {
  const isEditMode = !!task;
  const { user } = useUser();
  const { refetch } = useTasks();


  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const createTaskMutation = usePostProgressTasks();
  const updateTaskMutation = usePutProgressTasksTaskId();

  useEffect(() => {
    if (task) {
      setTitle(task.title ?? "");
      setDescription(task.description ?? "");
      setDueDate(task.due_date ?? "");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  }, [task]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("タイトルは必須です");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || undefined,
    };

    try {
      if (isEditMode && task) {
        await updateTaskMutation.mutateAsync({ taskId: task.id, data: payload });
        toast("更新完了",{description: "タスクを更新しました" });
      } else {
        await createTaskMutation.mutateAsync({ data: payload });
        toast("作成完了",{description: "新しいタスクを作成しました" });
      }
      refetch();
      onClose();
    } catch (err) {
      console.error("タスク保存失敗", err);
      toast("保存失敗",{description: "タスクの保存に失敗しました"});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "タスクの編集" : "新規タスク作成"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスク名"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="タスクの説明"
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>{isEditMode ? "更新" : "作成"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
