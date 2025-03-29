
import React, { useState, useEffect } from 'react';
import JournalHeader from '@/components/JournalHeader';
import DailyReflection from '@/components/DailyReflection';
import TodayGoals from '@/components/TodayGoals';
import DailyAchievements from '@/components/DailyAchievements';
import JournalSaveButton from '@/components/JournalSaveButton';
import { DailyAchievement, GoalItem, JournalEntry } from '@/types/journalTypes';
import { loadJournalEntries, saveJournalEntries, getEntryByDate, saveOrUpdateEntry } from '@/services/journalService';
import { Navigate } from 'react-router-dom';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState<string>('');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [achievements, setAchievements] = useState<DailyAchievement[]>([]);
  const [journalState, setJournalState] = useState({ entries: [], defaultAchievements: [] });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is authenticated
  useEffect(() => {
    try {
      const user = localStorage.getItem('journal-user');
      if (user) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Consider this user as not authenticated if localStorage fails
      setIsAuthenticated(false);
    }
  }, []);

  // Load journal entries on component mount
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const user = JSON.parse(localStorage.getItem('journal-user') || '{}');
        const savedJournalState = loadJournalEntries(user.id);
        setJournalState(savedJournalState);
      } catch (error) {
        console.error("Error loading journal entries:", error);
        // Use empty state if loading fails
        setJournalState({ entries: [], defaultAchievements: [] });
      }
    }
  }, [isAuthenticated]);

  // Load journal entry when selected date changes
  useEffect(() => {
    if (!journalState.entries.length) return;
    
    const entry = getEntryByDate(journalState.entries, selectedDate);
    
    if (entry) {
      setContent(entry.content || '');
      setGoals(entry.goals || []);
      setAchievements(entry.achievements || []);
    } else {
      // Reset fields if no entry exists for selected date
      setContent('');
      setGoals([]);
      
      // For a new day, add default achievements but mark them as not completed
      const defaultAchievements = journalState.defaultAchievements.map(a => ({
        ...a,
        id: Date.now() + Math.random().toString(),
        completed: false
      }));
      setAchievements(defaultAchievements);
    }
  }, [selectedDate, journalState.entries, journalState.defaultAchievements]);

  const handleSave = () => {
    try {
      // Ensure we're using the current date without any timezone issues
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      const entry: JournalEntry = {
        id: getEntryByDate(journalState.entries, selectedDate)?.id || Date.now().toString(),
        date: selectedDate.toISOString().split('T')[0] + 'T00:00:00.000Z',
        content,
        goals,
        achievements,
      };

      const user = JSON.parse(localStorage.getItem('journal-user') || '{}');
      const updatedState = saveOrUpdateEntry(journalState, entry);
      setJournalState(updatedState);
      saveJournalEntries(updatedState, user.id);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      // Handle saving error - could show a toast message here
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container max-w-4xl py-8 journal-container animate-fade-in">
      <JournalHeader 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        achievements={achievements.filter(a => a.completed)}
      />
      
      <div className="space-y-6">
        <DailyReflection content={content} setContent={setContent} />
        <TodayGoals goals={goals} setGoals={setGoals} />
        <DailyAchievements 
          achievements={achievements} 
          setAchievements={setAchievements}
          defaultAchievements={journalState.defaultAchievements}
          setDefaultAchievements={(newDefaults) => {
            try {
              setJournalState({
                ...journalState,
                defaultAchievements: newDefaults
              });
              
              // Save the updated default achievements
              const user = JSON.parse(localStorage.getItem('journal-user') || '{}');
              saveJournalEntries({
                ...journalState,
                defaultAchievements: newDefaults
              }, user.id);
            } catch (error) {
              console.error("Error saving default achievements:", error);
            }
          }}
        />
        <JournalSaveButton onSave={handleSave} />
      </div>
    </div>
  );
};

export default Journal;
