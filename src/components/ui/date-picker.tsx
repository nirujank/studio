"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
    name?: string;
    defaultValue?: Date;
    onDateSelect?: (date: Date | undefined) => void;
} & Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'initialFocus'>;


export function DatePicker({ name, defaultValue, onDateSelect, ...props }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue)

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if(onDateSelect) {
      onDateSelect(selectedDate);
    }
  }
  
  React.useEffect(() => {
    setDate(defaultValue);
  }, [defaultValue]);

  return (
    <Popover>
      <input type="hidden" name={name} value={date?.toISOString() || ''} />
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  )
}
