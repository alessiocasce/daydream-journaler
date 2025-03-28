
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface TomorrowGoalsProps {
  goals: string;
  setGoals: (goals: string) => void;
}

const TomorrowGoals = ({ goals, setGoals }: TomorrowGoalsProps) => {
  return (
    <Card className="mb-6 border-journal-light-purple shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-journal-purple">Tomorrow's Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="What would you like to accomplish tomorrow?"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="journal-textarea focus:border-none"
        />
      </CardContent>
    </Card>
  );
};

export default TomorrowGoals;
