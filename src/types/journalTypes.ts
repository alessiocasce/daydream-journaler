
export interface DayRatingItem {
  id: string;
  text: string;
  type: 'good' | 'bad';
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  content: string;
  goals: string;
  dayRatings: DayRatingItem[];
}

export interface JournalState {
  entries: JournalEntry[];
}
