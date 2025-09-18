// src/components/task/StatusBadgeCell.tsx

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type {
  ObjectiveUpdateStatus as updateStatusType,
  ProgressStatus as StatusType,
  TaskUpdateStatus,
} from '@/api/generated/taskProgressAPI.schemas';
import { TaskStatus } from '@/api/generated/taskProgressAPI.schemas';

const STATUS_LABELS: Record<StatusType, string> = {
  UNDEFINED: '未定義',
  NOT_STARTED: '未着手',
  IN_PROGRESS: '進行中',
  COMPLETED: '完了',
  SAVED: '保存',
};

const STATUS_COLORS: Record<StatusType, string> = {
  UNDEFINED: 'bg-muted',
  NOT_STARTED: 'bg-gray-400',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-green-600',
  SAVED: 'bg-yellow-500',
};

type Props = {
  value: StatusType | TaskStatus;
  onChange?: (newStatus: updateStatusType | TaskUpdateStatus) => void;
  disabled?: boolean;
};

export const StatusBadgeCell = ({ value, onChange, disabled = false }: Props) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (status: updateStatusType) => {
    if (onChange) {
      onChange(status);
    }
    setOpen(false); // ✅ 選択後に閉じる
  };

  const currentStatus = value || 'UNDEFINED';
  const statusLabel = STATUS_LABELS[currentStatus as StatusType] || String(currentStatus) || '不明';
  const statusColor = STATUS_COLORS[currentStatus as StatusType] || 'bg-muted';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`min-w-[80px] h-6 justify-center cursor-pointer ${statusColor}`}
          disabled={disabled}
        >
          {statusLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-2 w-40"
        align="center"
        side="bottom"
        onCloseAutoFocus={(e) => {
          e.preventDefault(); // デフォルトのフォーカス戻しを無効化
          document.getElementById('status-trigger')?.focus(); // 自分で制御
        }}
      >
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <Button
            key={status}
            variant="ghost"
            size="sm"
            className="w-full justify-start h-8 mb-1 last:mb-0"
            onClick={() => handleSelect(status as StatusType)}
          >
            {label}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
