// src/components/task/StatusBadgeCell.tsx
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { ProgressStatus as StatusType, ObjectiveUpdateStatus as updateStatusType } from "@/api/generated/taskProgressAPI.schemas";



const STATUS_LABELS: Record<StatusType, string> = {
  UNDEFINED: "未定義",
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  SAVED: "保存済み",
};

const STATUS_COLORS: Record<StatusType, string> = {
  UNDEFINED: "bg-muted",
  NOT_STARTED: "bg-gray-400",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-600",
  SAVED: "bg-yellow-500",
};

type Props = {
  value: StatusType;
  onChange: (newStatus: updateStatusType) => void;
  disabled?: boolean;
};

export function StatusBadgeCell({ value, onChange, disabled = false }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (status: updateStatusType) => {
    onChange(status);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          className={`cursor-pointer ${STATUS_COLORS[value]}`}
          variant="outline"
        >
          {STATUS_LABELS[value] ?? value}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-40">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <Button
            key={status}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleSelect(status as StatusType)}
            disabled={disabled}
          >
            {label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
