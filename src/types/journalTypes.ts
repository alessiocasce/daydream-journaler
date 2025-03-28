
export interface DailyAchievement {
  id: string;
  text: string;
  emoji: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  goals: GoalItem[];
  achievements: DailyAchievement[];
}

export interface JournalState {
  entries: JournalEntry[];
  defaultAchievements: DailyAchievement[];
}

export interface User {
  id: string;
  username: string;
  password: string; // Note: In a real app, this should be hashed
}
