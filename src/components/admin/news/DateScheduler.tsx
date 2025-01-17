import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSchedulerProps {
  scheduledDate?: Date;
  onScheduledDateChange: (date?: Date) => void;
}

export const DateScheduler = ({ scheduledDate, onScheduledDateChange }: DateSchedulerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !scheduledDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {scheduledDate ? format(scheduledDate, "PPP") : "Schedule post"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={scheduledDate}
            onSelect={onScheduledDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="outline"
        onClick={() => onScheduledDateChange(undefined)}
      >
        Clear Schedule
      </Button>
    </div>
  );
};