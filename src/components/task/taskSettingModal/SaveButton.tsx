// src/components/task/taskSettingModal/SaveButton.tsx

import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  isEditable: boolean;
  isSaving: boolean;
  onSave: () => void;
  onClose: () => void;
}

export function SaveButton({ isEditable, isSaving, onSave, onClose }: SaveButtonProps) {
  return (
    <div className="mt-6 flex justify-end">
      {isEditable ? (
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存"}
        </Button>
      ) : (
        <Button variant="outline" onClick={onClose}>
          閉じる
        </Button>
      )}
    </div>
  );
}

