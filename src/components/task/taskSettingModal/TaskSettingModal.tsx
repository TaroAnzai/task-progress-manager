// src/components/task/taskSettingModal/TaskSettingModal.tsx

import type { Task } from "@/api/generated/taskProgressAPI.schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useTaskEditModal } from "./hooks/useTaskEditModal";
import { ObjectiveSection } from "./ObjectiveSection";
import { SaveButton } from "./SaveButton";
import { TaskEditForm } from "./TaskEditForm";



interface TaskSettingModalProps {
  open: boolean;
  task: Task;
  onClose: () => void;
}

export function TaskSettingModal({ open, task, onClose }: TaskSettingModalProps) {
  const {
    formState,
    isEditable,
    handleChange,
    handleSave,
    isSaving,
    objectives,
    handleRemoveObjective
  } = useTaskEditModal(task, onClose);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>タスクの編集</DialogTitle>
          <DialogDescription>タスクを編集します</DialogDescription>
        </DialogHeader>

        <TaskEditForm formState={formState} isEditable={isEditable} onChange={handleChange} />

        <ObjectiveSection
          taskId={task.id}
          objectives={objectives}
          isEditable={isEditable}
          onRemoveObjective={handleRemoveObjective}
        />
        <SaveButton
          isEditable={isEditable}
          isSaving={isSaving}
          onSave={handleSave}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
