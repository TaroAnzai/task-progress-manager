// src/components/task/objective/DateCell.tsx
import { useState, useRef, useEffect } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null); 

    useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
  };
 // エンターキーが押されたときに値を検証して保存するハンドラ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const parsed = parse(inputValue, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) {
        onSave(format(parsed, "yyyy-MM-dd"));
        setInputValue(format(parsed, "yyyy-MM-dd"));
         inputRef.current?.blur();
      } 
    }
  };
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setInputValue(formatted);
      onSave(formatted);
      setOpen(false);
      inputRef.current?.blur(); 
    }
  };
  const handleBlur = () => {
    setInputValue(value ?? "");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          className="border px-1 rounded w-32"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
