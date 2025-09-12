// src/components/task/StatusBadgeCell.tsx

import { Badge } from '@/components/ui/badge';
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
  const handleSelect = (status: updateStatusType) => {
    if (onChange) {
      onChange(status);
    }
  };

  // valueがnullやundefinedの場合のフォールバック
  const currentStatus = value || 'UNDEFINED';
  const statusLabel = STATUS_LABELS[currentStatus as StatusType] || String(currentStatus) || '不明';
  const statusColor = STATUS_COLORS[currentStatus as StatusType] || 'bg-muted';

  // disabledの場合はPopoverを使わずに単純なBadgeを返す
  if (disabled) {
    return (
      <Badge
        className={`min-w-[60px] justify-center cursor-not-allowed ${statusColor}`}
        variant="outline"
      >
        {statusLabel}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-1 h-auto">
          <Badge
            className={`min-w-[60px] justify-center cursor-pointer ${statusColor}`}
            variant="outline"
          >
            {statusLabel}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-40" align="center" side="bottom">
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
