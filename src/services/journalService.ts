
import { JournalEntry, JournalState } from '@/types/journalTypes';

const STORAGE_KEY = 'daydream-journal';

export const loadJournalEntries = (): JournalState => {
  if (typeof window === 'undefined') {
    return { entries: [] };
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
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
