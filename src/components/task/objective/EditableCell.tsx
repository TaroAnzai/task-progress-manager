// src/components/task/objective/EditableCell.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";

type EditableCellProps = {
  value: string;
  onSave: (newValue: string) => void;
};

export function EditableCell({ value, onSave }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    if (inputValue !== value) {
      onSave(inputValue);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditing(false);
      setInputValue(value); // 元に戻す
    }
  };

  return editing ? (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <div onClick={() => setEditing(true)} className="cursor-pointer text-left w-full min-h-[1.5rem]">
      {value || "+"}
    </div>
  );
}
