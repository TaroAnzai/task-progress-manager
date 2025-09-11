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
    if (onChange) onChange(status);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" disabled={disabled}>
          <Badge
            className={`min-w-[60px] justify-center ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}  ${STATUS_COLORS[value]} `}
            variant="outline"
          >
            {STATUS_LABELS[value] ?? value}
          </Badge>
        </Button>
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
};
