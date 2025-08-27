//src/components/taskr/remainderSettingModal/RemainderSettingModal.tsx
import {
  useDeleteProgressRemindersSettingId,
  useGetProgressObjectivesObjectiveIdReminders,
  usePatchProgressRemindersSettingId,
  usePostProgressObjectivesObjectiveIdReminders,
} from '@/api/generated/taskProgressAPI';
import type { ObjectiveReminderSettingInput } from '@/api/generated/taskProgressAPI.schemas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAlertDialog } from '@/context/useAlertDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { ObjectiveReminderSettingForm } from './objectiveReminderSettingForm';
import { ReminderTable } from './reminderTable';

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
      onSuccess: () => {
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
  const { mutate: updateReminder } = usePatchProgressRemindersSettingId({
    mutation: {
      onSuccess: () => {
        toast.success('Reminderを更新しました');
        refetch();
      },
      onError: (error) => {
        openAlertDialog({
          title: 'Error',
          description: error,
          confirmText: '閉じる',
          showCancel: false,
        });
        console.error('Error update reminder:', error);
      },
    },
  })
  const { mutate: deleteReminder } = useDeleteProgressRemindersSettingId({
    mutation: {
      onSuccess: () => {
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
    if (selectedReminderId) {
      updateReminder({ settingId: selectedReminderId, data: data })
    } else {
      postReminder({ objectiveId: objective_id, data: data });
    }
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
          <ReminderTable isLoading={isLoading} reminderSettings={reminderSettings} onClick={setSelectedReminderId} />
          <ObjectiveReminderSettingForm
            reminderData={reminderSettings?.items.find((r) => r.id === selectedReminderId) || null}
            onSubmit={(data) => {
              handleCreateReminder(data);
            }}
            onDelete={(setting_id) => {
              handleDeleteReminder(setting_id);
            }}
            onReset={() => setSelectedReminderId(null)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
