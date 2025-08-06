// src/components/task/objective/DateCell.tsx
import { useState } from "react";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DateCellProps = {
  value?: string | null;
  onSave: (newDate: string | undefined) => void;
};

export function DateCell({ value, onSave }: DateCellProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const parsed = parse(val, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) {
      onSave(format(parsed, "yyyy-MM-dd"));
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setInputValue(formatted);
      onSave(formatted);
      setOpen(false);
    }

  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          className="border px-1 rounded w-32"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
          placeholder="YYYY-MM-DD"
        />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={inputValue && isValid(new Date(inputValue)) ? new Date(inputValue) : undefined}
          onSelect={handleCalendarSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
