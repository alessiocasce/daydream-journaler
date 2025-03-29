
import { JournalEntry, JournalState } from "@/types/journalTypes";
import { safeStorage } from "@/App";

// Load journal entries from storage
export const loadJournalEntries = (userId: string): JournalState => {
  try {
    const storageKey = `journal-data-${userId}`;
    const savedData = safeStorage.getItem(storageKey);
    
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error("Error loading journal entries:", error);
  }
  
  // Return default state if no saved data or error
  return {
    entries: [],
    defaultAchievements: []
  };
};

// Save journal entries to storage
export const saveJournalEntries = (journalState: JournalState, userId: string): void => {
  try {
    const storageKey = `journal-data-${userId}`;
    safeStorage.setItem(storageKey, JSON.stringify(journalState));
  } catch (error) {
    console.error("Error saving journal entries:", error);
  }
};

// Get entry for a specific date
export const getEntryByDate = (entries: JournalEntry[], date: Date): JournalEntry | undefined => {
  const dateString = date.toISOString().split('T')[0];
  return entries.find(entry => entry.date.startsWith(dateString));
};

// Add or update an entry
export const saveOrUpdateEntry = (journalState: JournalState, entry: JournalEntry): JournalState => {
  const { entries } = journalState;
  const entryIndex = entries.findIndex(e => e.id === entry.id);
  
  const updatedEntries = entryIndex >= 0
    ? entries.map(e => e.id === entry.id ? entry : e)
    : [...entries, entry];
  
  return {
    ...journalState,
    entries: updatedEntries
  };
};
