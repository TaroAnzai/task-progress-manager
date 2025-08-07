// src/components/task/taskSettingModal/TaskSettingModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTaskEditModal } from "./hooks/useTaskEditModal";
import { TaskEditForm } from "./TaskEditForm";
import { ObjectiveSection } from "./ObjectiveSection";
import { ScopeSection } from "./ScopeSection";
import { SaveButton } from "./SaveButton";
import type { Task } from "@/api/generated/taskProgressAPI.schemas";


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
    scopeUsers,
    scopeOrgs,
    handleAddUser,
    handleRemoveUser,
    handleAddOrg,
    handleRemoveOrg,
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

        <ScopeSection
          isEditable={isEditable}
          users={scopeUsers}
          orgs={scopeOrgs}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onAddOrg={handleAddOrg}
          onRemoveOrg={handleRemoveOrg}
        />

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
