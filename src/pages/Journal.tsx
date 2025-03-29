
import React, { useState, useEffect, useContext } from 'react';
import JournalHeader from '@/components/JournalHeader';
import DailyReflection from '@/components/DailyReflection';
import TodayGoals from '@/components/TodayGoals';
import DailyAchievements from '@/components/DailyAchievements';
import JournalSaveButton from '@/components/JournalSaveButton';
import { DailyAchievement, GoalItem, JournalEntry, JournalState } from '@/types/journalTypes';
import { StorageContext } from '../App';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState<string>('');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [achievements, setAchievements] = useState<DailyAchievement[]>([]);
  const [journalState, setJournalState] = useState<JournalState>({ 
    entries: [], 
    defaultAchievements: [] 
  });
  
  const safeStorage = useContext(StorageContext);
  const { user } = useAuth();
  
  // Create a user-specific storage key
  const JOURNAL_STORAGE_KEY = `daydream-journal-data-${user?.id || 'guest'}`;

  // Load journal entries on component mount
  useEffect(() => {
    try {
      const savedData = safeStorage.getItem(JOURNAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Handle migration from old format if needed
        const migratedEntries = parsedData.entries?.map((entry: any) => {
          // Handle case when entry has old goals format
          if (typeof entry.goals === 'string') {
            entry.goals = entry.goals ? [{ id: Date.now().toString(), text: entry.goals, completed: false }] : [];
          }
          
          // Handle case when entry doesn't have achievements
          if (!entry.achievements) {
            entry.achievements = [];
          }
          
          // Fix date if needed (ensure it's at midnight)
          if (entry.date) {
            const dateOnly = entry.date.split('T')[0];
            entry.date = `${dateOnly}T00:00:00.000Z`;
          }
          
          return entry;
        }) || [];
        
        setJournalState({ 
          entries: migratedEntries,
          defaultAchievements: parsedData.defaultAchievements || []
        });
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast.error('Failed to load your journal data');
    }
  }, [JOURNAL_STORAGE_KEY, safeStorage]);

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

  const getEntryByDate = (entries: JournalEntry[], date: Date): JournalEntry | undefined => {
    const dateString = date.toISOString().split('T')[0];
    return entries.find(entry => entry.date.startsWith(dateString));
  };

  const saveOrUpdateEntry = (state: JournalState, entry: JournalEntry): JournalState => {
    const existingEntryIndex = state.entries.findIndex(e => e.date.startsWith(entry.date.split('T')[0]));
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...state.entries];
      updatedEntries[existingEntryIndex] = entry;
      return { ...state, entries: updatedEntries };
    } else {
      // Add new entry
      return { ...state, entries: [...state.entries, entry] };
    }
  };

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

      const updatedState = saveOrUpdateEntry(journalState, entry);
      setJournalState(updatedState);
      
      safeStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedState));
      // Toast is now handled in the JournalSaveButton component
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save your journal entry');
    }
  };

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
            const updatedState = {
              ...journalState,
              defaultAchievements: newDefaults
            };
            setJournalState(updatedState);
            
            // Save the updated default achievements
            safeStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedState));
          }}
        />
        <JournalSaveButton onSave={handleSave} />
      </div>
    </div>
  );
};

export default Journal;
