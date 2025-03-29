
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Book, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DailyAchievement } from '@/types/journalTypes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface JournalHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  achievements?: DailyAchievement[];
}

const JournalHeader = ({ selectedDate, setSelectedDate, achievements = [] }: JournalHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6 text-journal-purple" />
        <h1 className="text-2xl font-semibold">Daydream Journal</h1>
        
        {achievements && achievements.length > 0 && (
          <div className="flex ml-2">
            {achievements.map((achievement) => (
              <span key={achievement.id} className="text-xl" title={achievement.text}>
                {achievement.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
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

        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default JournalHeader;
