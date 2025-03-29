
import React, { useState, useEffect } from 'react';
import JournalHeader from '@/components/JournalHeader';
import DailyReflection from '@/components/DailyReflection';
import TodayGoals from '@/components/TodayGoals';
import DailyAchievements from '@/components/DailyAchievements';
import JournalSaveButton from '@/components/JournalSaveButton';
import { DailyAchievement, GoalItem, JournalEntry, JournalState } from '@/types/journalTypes';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { fetchJournalEntries, saveJournalEntry, saveDefaultAchievements } from '@/services/journalService';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState<string>('');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [achievements, setAchievements] = useState<DailyAchievement[]>([]);
  const [journalState, setJournalState] = useState<JournalState>({ 
    entries: [], 
    defaultAchievements: [] 
  });
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { user, token } = useAuth();

  // Load journal entries on component mount
  useEffect(() => {
    const loadJournalEntries = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const data = await fetchJournalEntries(token);
        if (data) {
          setJournalState(data);
        }
        setIsInitialLoad(false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading journal entries:', error);
        toast.error('Failed to load your journal data');
        setIsInitialLoad(false);
        setIsLoading(false);
      }
    };

    loadJournalEntries();
  }, [token]);

  // Load journal entry when selected date changes or on initial load
  useEffect(() => {
    if (!journalState.entries.length || isLoading) return;
    
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
  }, [selectedDate, journalState.entries, journalState.defaultAchievements, isInitialLoad, isLoading]);

  const getEntryByDate = (entries: JournalEntry[], date: Date): JournalEntry | undefined => {
    const dateString = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date.startsWith(dateString));
  };

  const handleSave = async () => {
    if (!token || !user) {
      toast.error('You must be logged in to save');
      return;
    }
    
    try {
      // Ensure we're using the current date without any timezone issues
      const dateStr = selectedDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
      
      const entry: JournalEntry = {
        id: getEntryByDate(journalState.entries, selectedDate)?.id || Date.now().toString(),
        date: dateStr,
        content,
        goals,
        achievements,
      };

      const success = await saveJournalEntry(entry, token);
      
      if (success) {
        // Refresh journal entries after save
        const updatedData = await fetchJournalEntries(token);
        if (updatedData) {
          setJournalState(updatedData);
        }
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save your journal entry');
    }
  };

  const handleSaveDefaultAchievements = async (newDefaults: DailyAchievement[]) => {
    if (!token || !user) {
      toast.error('You must be logged in to save default achievements');
      return;
    }
    
    try {
      const success = await saveDefaultAchievements(newDefaults, token);
      
      if (success) {
        const updatedState = {
          ...journalState,
          defaultAchievements: newDefaults
        };
        setJournalState(updatedState);
      }
    } catch (error) {
      console.error('Error saving default achievements:', error);
      toast.error('Failed to save default achievements');
    }
  };

  if (isLoading && isInitialLoad) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-journal-purple"></div>
      </div>
    );
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
          setDefaultAchievements={handleSaveDefaultAchievements}
        />
        <JournalSaveButton onSave={handleSave} />
      </div>
    </div>
  );
};

export default Journal;
