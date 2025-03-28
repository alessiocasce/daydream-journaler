
import { JournalEntry, JournalState, GoalItem, DailyAchievement } from '@/types/journalTypes';

const STORAGE_KEY_PREFIX = 'daydream-journal-';

export const loadJournalEntries = (userId: string): JournalState => {
  if (typeof window === 'undefined') {
    return { entries: [], defaultAchievements: [] };
  }
  
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (saved) {
      const parsedData = JSON.parse(saved);
      
      // Migrate from old format if needed
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
      
      return { 
        entries: migratedEntries,
        defaultAchievements: parsedData.defaultAchievements || []
      };
    }
  } catch (error) {
    console.error('Error loading journal entries:', error);
  }
  
  return { entries: [], defaultAchievements: [] };
};

export const saveJournalEntries = (state: JournalState, userId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
};

export const getEntryByDate = (entries: JournalEntry[], date: Date): JournalEntry | undefined => {
  const dateString = date.toISOString().split('T')[0];
  return entries.find(entry => entry.date.startsWith(dateString));
};

export const saveOrUpdateEntry = (state: JournalState, entry: JournalEntry): JournalState => {
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
