//src/components/taskr/remainderSettingModal/RemainderSettingModal.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ObjectiveReminderSettingForm } from './objectiveReminderSettingForm';
import { ReminderTable } from './reminderTable';
import {
  useDeleteProgressRemindersSettingId,
  useGetProgressObjectivesObjectiveIdReminders,
  usePostProgressObjectivesObjectiveIdReminders,
} from '@/api/generated/taskProgressAPI';
import { toast } from 'sonner';
import { useAlertDialog } from '@/context/useAlertDialog';
import type { ObjectiveReminderSettingInput } from '@/api/generated/taskProgressAPI.schemas';

interface RemainderSettingModalProps {
  open: boolean;
  objective_id: number;
  onClose: () => void;
}

export const ReminderSettingModal = ({
  open,
  onClose,
  objective_id,
}: RemainderSettingModalProps) => {
  const [selectedReminderId, setSelectedReminderId] = useState<number | null>(null);
  const { openAlertDialog } = useAlertDialog();
  const {
    data: reminderSettings,
    isLoading,
    refetch,
  } = useGetProgressObjectivesObjectiveIdReminders(objective_id);
  const { mutate: postReminder } = usePostProgressObjectivesObjectiveIdReminders({
    mutation: {
      onSuccess: (data) => {
        toast.success('Reminderを登録しました');
        refetch();
      },
      onError: (error) => {
        openAlertDialog({
          title: 'Error',
          description: error,
          confirmText: '閉じる',
          showCancel: false,
        });
        console.error('Error creating reminder:', error);
      },
    },
  });
  const { mutate: deleteReminder } = useDeleteProgressRemindersSettingId({
    mutation: {
      onSuccess: (data) => {
        toast.success('Reminderを削除しました');
        refetch();
      },
      onError: (error) => {
        openAlertDialog({
          title: 'Error',
          description: error,
          confirmText: '閉じる',
          showCancel: false,
        });
        console.error('Error delete reminder:', error);
      },
    },
  });

  const handleCreateReminder = (data: ObjectiveReminderSettingInput) => {
    postReminder({ objectiveId: objective_id, data: data });
  };
  const handleDeleteReminder = (setting_id: number | undefined) => {
    deleteReminder({ settingId: setting_id! });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>リマインドの設定</DialogTitle>
          <DialogDescription>リマインドを設定します</DialogDescription>
        </DialogHeader>
        <div className="">
          <ReminderTable reminderSettings={reminderSettings} onClick={setSelectedReminderId} />
          <ObjectiveReminderSettingForm
            reminderData={reminderSettings?.items.find((r) => r.id === selectedReminderId) || null}
            onSubmit={(data) => {
              handleCreateReminder(data);
            }}
            onDelete={(setting_id) => {
              handleDeleteReminder(setting_id);
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
