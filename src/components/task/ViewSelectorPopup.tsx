// src/components/task/ViewSelectorPopup.tsx

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'task_view_mode';

const OPTIONS = [
  { label: '自分のタスクのみ', value: 'mine' },
  { label: '全てのタスク', value: 'all' },
];

interface ViewSelectorPopupProps {
  onChange: (value: string) => void;
}

export default function ViewSelectorPopup({ onChange }: ViewSelectorPopupProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || 'all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem(STORAGE_KEY, value);
    onChange(value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        id="view-selecter-btn"
      >
        表示切替
      </Button>
      {open && (
        <div className="absolute z-10 mt-1 w-48 rounded-md border bg-white shadow-md" id="view-selector-popup">
          {OPTIONS.map((opt) => (
            <div
              key={opt.value}
              data-value={opt.value}
              className={cn(
                'px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer',
                opt.value === selected && 'bg-gray-100 font-semibold'
              )}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
