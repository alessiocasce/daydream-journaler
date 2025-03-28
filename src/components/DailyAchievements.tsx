
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { DailyAchievement } from '@/types/journalTypes';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DailyAchievementsProps {
  achievements: DailyAchievement[];
  defaultAchievements: DailyAchievement[];
  setAchievements: (achievements: DailyAchievement[]) => void;
  setDefaultAchievements: (achievements: DailyAchievement[]) => void;
}

const emojiOptions = ["😊", "💪", "🏃", "🧘", "💤", "🍎", "💧", "📚", "🧠", "🌱"];

const DailyAchievements = ({ 
  achievements, 
  defaultAchievements, 
  setAchievements, 
  setDefaultAchievements 
}: DailyAchievementsProps) => {
  const [newAchievementText, setNewAchievementText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [isDefault, setIsDefault] = useState(true);

  const addAchievement = () => {
    if (newAchievementText.trim() === '') {
      toast.error('Please enter some text for your achievement.');
      return;
    }

    const newAchievement: DailyAchievement = {
      id: Date.now().toString(),
      text: newAchievementText.trim(),
      emoji: selectedEmoji,
      completed: false
    };
    
    // Add to current day achievements
    setAchievements([...achievements, newAchievement]);
    
    // If set as default, add to default achievements
    if (isDefault) {
      setDefaultAchievements([...defaultAchievements, newAchievement]);
    }
    
    setNewAchievementText('');
    toast.success('Achievement added successfully!');
  };

  const toggleAchievement = (id: string) => {
    setAchievements(
      achievements.map(achievement => 
        achievement.id === id ? { ...achievement, completed: !achievement.completed } : achievement
      )
    );
  };

  const removeAchievement = (id: string) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
    toast.info('Achievement removed.');
  };

  return (
    <Card className="mb-6 border-journal-light-purple shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-journal-purple">Daily Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Add a new achievement..."
                value={newAchievementText}
                onChange={(e) => setNewAchievementText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                className="flex-1"
              />
              <Button 
                onClick={addAchievement}
                className="bg-journal-purple hover:bg-journal-dark-purple"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {emojiOptions.map(emoji => (
                <Button 
                  key={emoji}
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 p-0 ${selectedEmoji === emoji ? "bg-journal-purple hover:bg-journal-dark-purple" : ""}`}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="default-achievement"
                checked={isDefault}
                onCheckedChange={() => setIsDefault(!isDefault)}
                className={isDefault ? "bg-journal-purple border-journal-purple" : ""}
              />
              <label htmlFor="default-achievement" className="text-sm">
                Add to daily defaults
              </label>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No achievements added yet. Add some above!</p>
            ) : (
              achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-between group bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{achievement.emoji}</span>
                    <Checkbox 
                      id={`achievement-${achievement.id}`}
                      checked={achievement.completed}
                      onCheckedChange={() => toggleAchievement(achievement.id)}
                      className={achievement.completed ? "bg-journal-purple border-journal-purple" : ""}
                    />
                    <label 
                      htmlFor={`achievement-${achievement.id}`}
                      className={`text-sm ${achievement.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {achievement.text}
                    </label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeAchievement(achievement.id)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyAchievements;
