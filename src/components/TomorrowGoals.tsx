
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GoalItem } from '@/types/journalTypes';
import { PlusCircle, X } from 'lucide-react';

interface TodayGoalsProps {
  goals: GoalItem[];
  setGoals: (goals: GoalItem[]) => void;
}

const TodayGoals = ({ goals, setGoals }: TodayGoalsProps) => {
  const [newGoalText, setNewGoalText] = useState('');

  const addGoal = () => {
    if (newGoalText.trim() === '') return;
    
    const newGoal: GoalItem = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false
    };
    
    setGoals([...goals, newGoal]);
    setNewGoalText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addGoal();
    }
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(
      goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <Card className="mb-6 border-journal-light-purple shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-journal-purple">Today's Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Input 
            placeholder="Add a new goal..."
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={addGoal} 
            size="sm" 
            className="bg-journal-purple hover:bg-journal-dark-purple"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No goals added yet. Add some goals above!</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id={`goal-${goal.id}`}
                    checked={goal.completed}
                    onCheckedChange={() => toggleGoalCompletion(goal.id)}
                    className={goal.completed ? "bg-journal-purple border-journal-purple" : ""}
                  />
                  <label 
                    htmlFor={`goal-${goal.id}`}
                    className={`text-sm ${goal.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {goal.text}
                  </label>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeGoal(goal.id)} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayGoals;
