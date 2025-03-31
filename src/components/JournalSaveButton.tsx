
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
      duration: 1500, // Reduce duration to 1.5 seconds
      id: 'journal-save', // Add ID to prevent duplicate toasts
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
