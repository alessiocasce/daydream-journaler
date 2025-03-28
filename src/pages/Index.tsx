
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Book } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-journal-light-purple to-journal-soft-blue">
      <div className="text-center max-w-lg p-8 rounded-lg bg-white/90 backdrop-blur-sm shadow-xl">
        <div className="mb-4 mx-auto w-16 h-16 bg-journal-purple rounded-full flex items-center justify-center">
          <Book className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-journal-purple">Daydream Journal</h1>
        
        <p className="text-lg text-gray-700 mb-8">
          Capture your daily reflections, set intentions for tomorrow, and track the moments that matter most.
        </p>
        
        <Button 
          onClick={() => navigate('/journal')}
          className="bg-journal-purple hover:bg-journal-dark-purple text-white px-8 py-6 text-lg h-auto"
        >
          Open Journal
        </Button>
      </div>
    </div>
  );
};

export default Index;
