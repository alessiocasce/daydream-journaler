
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import JournalHeader from '@/components/JournalHeader';
import DailyReflection from '@/components/DailyReflection';
import TodayGoals from '@/components/TomorrowGoals';
import DayRating from '@/components/DayRating';
import JournalSaveButton from '@/components/JournalSaveButton';
import { DayRatingItem, GoalItem, JournalEntry } from '@/types/journalTypes';
import { loadJournalEntries, saveJournalEntries, getEntryByDate, saveOrUpdateEntry } from '@/services/journalService';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState<string>('');
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [dayRatings, setDayRatings] = useState<DayRatingItem[]>([]);
  const [journalState, setJournalState] = useState({ entries: [] });

  // Load journal entries on component mount
  useEffect(() => {
    const savedJournalState = loadJournalEntries();
    setJournalState(savedJournalState);
  }, []);

  // Load journal entry when selected date changes
  useEffect(() => {
    const entry = getEntryByDate(journalState.entries, selectedDate);
    
    if (entry) {
      setContent(entry.content || '');
      // Handle both string and GoalItem[] for backward compatibility
      if (typeof entry.goals === 'string') {
        // Convert old string format to new GoalItem[] format if needed
        setGoals(entry.goals ? [{ id: '1', text: entry.goals, completed: false }] : []);
      } else {
        setGoals(entry.goals || []);
      }
      setDayRatings(entry.dayRatings || []);
    } else {
      // Reset fields if no entry exists for selected date
      setContent('');
      setGoals([]);
      setDayRatings([]);
    }
  }, [selectedDate, journalState.entries]);

  const handleSave = () => {
    const entry: JournalEntry = {
      id: getEntryByDate(journalState.entries, selectedDate)?.id || Date.now().toString(),
      date: selectedDate.toISOString(),
      content,
      goals,
      dayRatings,
    };

    const updatedState = saveOrUpdateEntry(journalState, entry);
    setJournalState(updatedState);
    saveJournalEntries(updatedState);
  };

  return (
    <div className="container max-w-4xl py-8 journal-container animate-fade-in">
      <JournalHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      
      <div className="space-y-6">
        <DailyReflection content={content} setContent={setContent} />
        <TodayGoals goals={goals} setGoals={setGoals} />
        <DayRating items={dayRatings} setItems={setDayRatings} />
        <JournalSaveButton onSave={handleSave} />
      </div>
    </div>
  );
};

export default Journal;
