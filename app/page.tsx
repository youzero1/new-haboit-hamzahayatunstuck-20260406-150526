'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import HabitCard from '@/components/HabitCard';
import WeeklyChart from '@/components/WeeklyChart';
import StatsRow from '@/components/StatsRow';
import { Habit, getDayKey, getCurrentStreak, getWeekDays } from '@/lib/habits';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitColor, setNewHabitColor] = useState('#6366f1');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('habits');
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch {
        setHabits([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits, mounted]);

  const addHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;
    const habit: Habit = {
      id: uuidv4(),
      name,
      color: newHabitColor,
      completedDays: {},
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [habit, ...prev]);
    setNewHabitName('');
  };

  const toggleDay = (habitId: string, dayKey: string) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? {
              ...h,
              completedDays: {
                ...h.completedDays,
                [dayKey]: !h.completedDays[dayKey]
              }
            }
          : h
      )
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const editHabit = (habitId: string, name: string, color: string) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, name, color } : h))
    );
  };

  const todayKey = getDayKey(new Date());
  const weekDays = getWeekDays();

  const totalCompletionsToday = habits.filter(h => h.completedDays[todayKey]).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, getCurrentStreak(h)), 0);
  const totalHabits = habits.length;
  const weeklyRate =
    habits.length > 0
      ? Math.round(
          (weekDays.reduce(
            (sum, d) => sum + habits.filter(h => h.completedDays[d.key]).length,
            0
          ) /
            (habits.length * 7)) *
            100
        )
      : 0;

  if (!mounted) return null;

  return (
    <div className="container">
      <div className="header">
        <h1>Habit Tracker</h1>
        <p>Build streaks, track progress, stay consistent</p>
      </div>

      <div className="add-habit-form">
        <h2>Add New Habit</h2>
        <div className="form-row">
          <input
            className="form-input"
            type="text"
            placeholder="Habit name (e.g. Morning run)"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addHabit()}
          />
          <select
            className="color-select"
            value={newHabitColor}
            onChange={e => setNewHabitColor(e.target.value)}
          >
            <option value="#6366f1">Indigo</option>
            <option value="#8b5cf6">Purple</option>
            <option value="#ec4899">Pink</option>
            <option value="#ef4444">Red</option>
            <option value="#f97316">Orange</option>
            <option value="#eab308">Yellow</option>
            <option value="#22c55e">Green</option>
            <option value="#06b6d4">Cyan</option>
            <option value="#3b82f6">Blue</option>
          </select>
          <button className="btn-primary" onClick={addHabit}>
            + Add Habit
          </button>
        </div>
      </div>

      {habits.length > 0 && (
        <StatsRow
          totalHabits={totalHabits}
          completedToday={totalCompletionsToday}
          longestStreak={longestStreak}
          weeklyRate={weeklyRate}
        />
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🌱</div>
          <p>No habits yet. Add your first habit above to get started!</p>
        </div>
      ) : (
        <>
          <div className="habits-grid">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                weekDays={weekDays}
                todayKey={todayKey}
                onToggleDay={toggleDay}
                onDelete={deleteHabit}
                onEdit={editHabit}
              />
            ))}
          </div>

          <div className="chart-section">
            <h2>📊 Weekly Progress</h2>
            <div className="chart-wrapper">
              <WeeklyChart habits={habits} weekDays={weekDays} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
