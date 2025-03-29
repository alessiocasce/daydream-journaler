
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface JournalSaveButtonProps {
  onSave: () => void;
}

const JournalSaveButton = ({ onSave }: JournalSaveButtonProps) => {
  const handleSave = () => {
    onSave();
    // Show toast notification with shorter duration
    toast.success('Journal entry saved successfully!', {
      duration: 2000, // Reduce duration to 2 seconds
    });
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleSave} 
        className="bg-journal-purple hover:bg-journal-dark-purple"
      >
        Save Journal Entry
      </Button>
    </div>
  );
};

export default JournalSaveButton;
