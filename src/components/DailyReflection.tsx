
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface DailyReflectionProps {
  content: string;
  setContent: (content: string) => void;
}

const DailyReflection = ({ content, setContent }: DailyReflectionProps) => {
  return (
    <Card className="mb-6 border-journal-light-purple shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-journal-purple">Today's Reflections</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write about your day, experiences, thoughts, and feelings..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="journal-textarea focus:border-none"
        />
      </CardContent>
    </Card>
  );
};

export default DailyReflection;
