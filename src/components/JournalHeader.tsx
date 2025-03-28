
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Book } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface JournalHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const JournalHeader = ({ selectedDate, setSelectedDate }: JournalHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6 text-journal-purple" />
        <h1 className="text-2xl font-semibold">Daydream Journal</h1>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              "border-journal-light-purple hover:bg-journal-light-purple/20"
            )}
          >
            <Calendar className="mr-2 h-4 w-4 text-journal-purple" />
            {format(selectedDate, 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default JournalHeader;
