
const express = require('express');
const { pool } = require('../config/db');

const router = express.Router();

// Get all journal entries for a user
router.get('/entries', async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await pool.getConnection();
    
    // Get all journal entries
    const [entries] = await connection.query(
      `SELECT * FROM journal_entries WHERE user_id = ? ORDER BY entry_date DESC`,
      [userId]
    );
    
    // Get goals for each entry
    const [goals] = await connection.query(
      `SELECT g.* FROM goals g
       JOIN journal_entries je ON g.journal_entry_id = je.id
       WHERE je.user_id = ?`,
      [userId]
    );
    
    // Get achievements for each entry
    const [achievements] = await connection.query(
      `SELECT a.* FROM achievements a
       JOIN journal_entries je ON a.journal_entry_id = je.id
       WHERE je.user_id = ?`,
      [userId]
    );
    
    // Get default achievements for the user
    const [defaultAchievements] = await connection.query(
      `SELECT * FROM default_achievements WHERE user_id = ?`,
      [userId]
    );
    
    connection.release();
    
    // Format entries with goals and achievements
    const formattedEntries = entries.map(entry => {
      const entryGoals = goals.filter(goal => goal.journal_entry_id === entry.id).map(goal => ({
        id: goal.id.toString(),
        text: goal.text,
        completed: Boolean(goal.completed)
      }));
      
      const entryAchievements = achievements.filter(achievement => achievement.journal_entry_id === entry.id).map(achievement => ({
        id: achievement.id.toString(),
        text: achievement.text,
        emoji: achievement.emoji,
        completed: Boolean(achievement.completed)
      }));

      // Fix: Ensure proper date format
      const formattedDate = entry.entry_date instanceof Date 
        ? entry.entry_date.toISOString().split('T')[0] + 'T00:00:00.000Z'
        : new Date(entry.entry_date).toISOString().split('T')[0] + 'T00:00:00.000Z';
      
      return {
        id: entry.id.toString(),
        date: formattedDate,
        content: entry.content || '',
        goals: entryGoals,
        achievements: entryAchievements
      };
    });
    
    // Format default achievements
    const formattedDefaultAchievements = defaultAchievements.map(achievement => ({
      id: achievement.id.toString(),
      text: achievement.text,
      emoji: achievement.emoji,
      completed: false
    }));
    
    res.json({
      entries: formattedEntries,
      defaultAchievements: formattedDefaultAchievements
    });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save or update journal entry
router.post('/entries', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { id, date, content, goals, achievements } = req.body;
    
    // Start transaction
    await connection.beginTransaction();
    
    // Fix: Properly format date to prevent timezone issues
    const dateOnly = date.split('T')[0];
    
    console.log('Server received date:', date);
    console.log('Using date for DB:', dateOnly);
    
    // Check if entry exists
    const [existingEntries] = await connection.query(
      'SELECT * FROM journal_entries WHERE user_id = ? AND DATE(entry_date) = ?',
      [userId, dateOnly]
    );
    
    let entryId;
    
    if (existingEntries.length > 0) {
      // Update existing entry
      entryId = existingEntries[0].id;
      await connection.query(
        'UPDATE journal_entries SET content = ? WHERE id = ?',
        [content, entryId]
      );
    } else {
      // Create new entry
      const [result] = await connection.query(
        'INSERT INTO journal_entries (user_id, entry_date, content) VALUES (?, ?, ?)',
        [userId, dateOnly, content]
      );
      entryId = result.insertId;
    }
    
    // Delete existing goals and achievements
    await connection.query('DELETE FROM goals WHERE journal_entry_id = ?', [entryId]);
    await connection.query('DELETE FROM achievements WHERE journal_entry_id = ?', [entryId]);
    
    // Insert goals
    if (goals && goals.length > 0) {
      const goalValues = goals.map(goal => [entryId, goal.text, goal.completed]);
      await connection.query(
        'INSERT INTO goals (journal_entry_id, text, completed) VALUES ?',
        [goalValues]
      );
    }
    
    // Insert achievements
    if (achievements && achievements.length > 0) {
      const achievementValues = achievements.map(achievement => 
        [entryId, achievement.text, achievement.emoji, achievement.completed]
      );
      await connection.query(
        'INSERT INTO achievements (journal_entry_id, text, emoji, completed) VALUES ?',
        [achievementValues]
      );
    }
    
    // Commit transaction
    await connection.commit();
    
    res.status(200).json({ message: 'Journal entry saved successfully' });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error('Save journal entry error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Save default achievements
router.post('/default-achievements', async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = req.body;
    
    if (!Array.isArray(achievements)) {
      return res.status(400).json({ message: 'Invalid achievements format' });
    }
    
    const connection = await pool.getConnection();
    
    // Start transaction
    await connection.beginTransaction();
    
    // Delete existing default achievements
    await connection.query(
      'DELETE FROM default_achievements WHERE user_id = ?',
      [userId]
    );
    
    // Insert new default achievements
    if (achievements.length > 0) {
      const values = achievements.map(achievement => 
        [userId, achievement.text, achievement.emoji]
      );
      
      await connection.query(
        'INSERT INTO default_achievements (user_id, text, emoji) VALUES ?',
        [values]
      );
    }
    
    // Commit transaction
    await connection.commit();
    connection.release();
    
    res.status(200).json({ message: 'Default achievements saved successfully' });
  } catch (error) {
    console.error('Save default achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
