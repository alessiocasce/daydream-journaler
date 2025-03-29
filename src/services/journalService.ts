
import { JournalState, DailyAchievement } from "@/types/journalTypes";
import { toast } from "sonner";

// Set this to your backend API URL
const API_URL = "http://localhost:5000/api";

// Fetch journal entries for a user
export const fetchJournalEntries = async (token: string): Promise<JournalState | null> => {
  try {
    const response = await fetch(`${API_URL}/journal/entries`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch journal entries');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred while fetching journal data');
    }
    return null;
  }
};

// Save a journal entry
export const saveJournalEntry = async (entry: any, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/journal/entries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save journal entry');
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred while saving journal entry');
    }
    return false;
  }
};

// Save default achievements
export const saveDefaultAchievements = async (achievements: DailyAchievement[], token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/journal/default-achievements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(achievements),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save default achievements');
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred while saving default achievements');
    }
    return false;
  }
};
