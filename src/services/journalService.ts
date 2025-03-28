
import { JournalEntry, JournalState, GoalItem } from '@/types/journalTypes';

const STORAGE_KEY = 'daydream-journal';

export const loadJournalEntries = (): JournalState => {
  if (typeof window === 'undefined') {
    return { entries: [] };
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      
      // Handle migration from old format (string goals) to new format (GoalItem[] goals)
      const migratedEntries = parsedData.entries.map((entry: any) => {
        if (typeof entry.goals === 'string') {
          return {
            ...entry,
            goals: entry.goals ? [{ id: Date.now().toString(), text: entry.goals, completed: false }] : []
          };
        }
        return entry;
      });
      
      return { entries: migratedEntries };
    }
  } catch (error) {
    console.error('Error loading journal entries:', error);
  }
  
  return { entries: [] };
};

export const saveJournalEntries = (state: JournalState): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    return { entries: updatedEntries };
  } else {
    // Add new entry
    return { entries: [...state.entries, entry] };
  }
};
