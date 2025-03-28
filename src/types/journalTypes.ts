
export interface DayRatingItem {
  id: string;
  text: string;
  type: 'good' | 'bad';
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
  dayRatings: DayRatingItem[];
}

export interface JournalState {
  entries: JournalEntry[];
}
