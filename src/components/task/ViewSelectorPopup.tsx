// src/components/task/ViewSelectorPopup.tsx

import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { TaskUserAccessLevel } from '@/api/generated/taskProgressAPI.schemas';
import { SCOPE_LABELS } from '@/context/roleLabels';
import type { FilterAccessLevel } from '@/pages/TaskPage';
interface ViewSelectorPopupProps {
  viewMode: Record<FilterAccessLevel, boolean>;
  onChange: (newValue: Record<FilterAccessLevel, boolean>) => void;
}

export const ViewSelectorPopup = ({ viewMode, onChange }: ViewSelectorPopupProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">表示選択</Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        {Object.entries(SCOPE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              className="m-1"
              id={key}
              checked={viewMode[key as TaskUserAccessLevel]}
              onCheckedChange={(checked) => {
                const newViewMode = { ...viewMode, [key]: checked === true };
                onChange(newViewMode);
              }}
            />
            <Label htmlFor={key}>{label}</Label>
          </div>
        ))}{' '}
        <div className="border-t my-2" />
        <div key="ASSIGNED" className="flex items-center space-x-2">
          <Checkbox
            className="m-1"
            id="ASSIGNED"
            checked={viewMode['ASSIGNED']}
            onCheckedChange={(checked) => {
              const newViewMode = { ...viewMode, ['ASSIGNED']: checked === true };
              onChange(newViewMode);
            }}
          />
          <Label htmlFor="ASSIGNED">担当者</Label>
        </div>
      </PopoverContent>
    </Popover>
  );
};
