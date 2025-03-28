
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface JournalSaveButtonProps {
  onSave: () => void;
}

const JournalSaveButton = ({ onSave }: JournalSaveButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={() => {
          onSave();
          toast.success('Journal entry saved successfully!');
        }} 
        className="bg-journal-purple hover:bg-journal-dark-purple"
      >
        Save Journal Entry
      </Button>
    </div>
  );
};

export default JournalSaveButton;
