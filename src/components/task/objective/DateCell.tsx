// src/components/task/objective/DateCell.tsx
import { useState, useRef, useEffect } from "react";

import { format, parse, isValid, isDate } from "date-fns";
import { is } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
type DateCellProps = {
  value?: string | null;
  onSave: (newDate: string | undefined) => void;
};

export function DateCell({ value, onSave }: DateCellProps) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const isFromCalender = useRef(true); 

    useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if(isFromCalender.current){
      onSave(val);
    }
  };
 // エンターキーが押されたときに値を検証して保存するハンドラ
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    isFromCalender.current = false;
    if (e.key === "Enter") {
      setInputValue(inputValue);
      onSave(inputValue);
      (e.target as HTMLInputElement).blur();
      isFromCalender.current = true;
      } 
  };
  const handleBlur = () => {
      setInputValue(value ?? "");
      isFromCalender.current = true;
  }

  return (
    <Input
      id="due_date"
      name="due_date"
      type="date"
      value={inputValue || ""}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
        className="
          focus:ring-2 focus:ring-ring focus:ring-offset-2
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        "
    />
  );
}
