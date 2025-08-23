import { useState } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { usePostProgressTasks } from '@/api/generated/taskProgressAPI';

import { useTasks } from '@/context/useTasks';

interface TaskSettingModalProps {
  open: boolean;
  onClose: () => void;
}

export const NewTaskModal = ({ open, onClose }: TaskSettingModalProps) => {
  const { refetch } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createTaskMutation = usePostProgressTasks();

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('タイトルは必須です');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || undefined,
    };

    try {
      await createTaskMutation.mutateAsync({ data: payload });
      toast('作成完了', { description: '新しいタスクを作成しました' });
      refetch();
      clearForm();
      onClose();
    } catch (err) {
      console.error('タスク保存失敗', err);
      toast('保存失敗', { description: 'タスクの保存に失敗しました' });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSave();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>"新規タスク作成"</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスク名"
            rows={1}
            className="h-auto min-h-0 resize-none overflow-hidden"
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="タスクの説明"
            className="h-auto min-h-0"
          />

          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                clearForm();
                onClose();
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleSave}>"作成"</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
