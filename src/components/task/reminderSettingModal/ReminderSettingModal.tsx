//src/components/taskr/remainderSettingModal/RemainderSettingModal.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ObjectiveReminderSettingForm } from "./objectiveReminderSettingForm";
import { ReminderTable } from './reminderTable';
interface RemainderSettingModalProps {
  open: boolean;
  objective_id: number;
  onClose: () => void;
}

export const ReminderSettingModal = ({ open, onClose, objective_id }: RemainderSettingModalProps) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>リマインドの設定</DialogTitle>
          <DialogDescription>リマインドを設定します</DialogDescription>
        </DialogHeader>
        <div className='flex'>
          <ObjectiveReminderSettingForm onSubmit={onClose} />
          <ReminderTable />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
