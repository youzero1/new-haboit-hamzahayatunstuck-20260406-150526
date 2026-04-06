'use client';

import { useState } from 'react';
import { Habit, WeekDay, getCurrentStreak, getCompletionRate } from '@/lib/habits';

interface Props {
  habit: Habit;
  weekDays: WeekDay[];
  todayKey: string;
  onToggleDay: (habitId: string, dayKey: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habitId: string, name: string, color: string) => void;
}

const COLOR_OPTIONS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#ef4444', label: 'Red' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#22c55e', label: 'Green' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#3b82f6', label: 'Blue' }
];

export default function HabitCard({ habit, weekDays, todayKey, onToggleDay, onDelete, onEdit }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editColor, setEditColor] = useState(habit.color);

  const streak = getCurrentStreak(habit);
  const rate = getCompletionRate(habit, weekDays);
  const todayDone = !!habit.completedDays[todayKey];

  const handleEdit = () => {
    if (editName.trim()) {
      onEdit(habit.id, editName.trim(), editColor);
      setShowEditModal(false);
    }
  };

  return (
    <>
      <div className="habit-card">
        <div className="habit-card-header">
          <div className="habit-title-row">
            <div className="habit-color-dot" style={{ backgroundColor: habit.color }} />
            <span className="habit-name">{habit.name}</span>
          </div>
          <div className="habit-actions">
            <button
              className="btn-icon"
              title="Edit"
              onClick={() => {
                setEditName(habit.name);
                setEditColor(habit.color);
                setShowEditModal(true);
              }}
            >
              ✏️
            </button>
            <button
              className="btn-icon danger"
              title="Delete"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="streak-row">
          <div className="streak-badge">
            <span className="fire">🔥</span>
            <span>{streak} day{streak !== 1 ? 's' : ''}</span>
          </div>
          <span className="completion-rate">This week: {rate}%</span>
        </div>

        <div className="week-dots">
          {weekDays.map(day => {
            const done = !!habit.completedDays[day.key];
            return (
              <div key={day.key} className="week-dot-wrapper">
                <span className="week-dot-label">{day.short}</span>
                <button
                  className={`week-dot ${
                    done ? 'completed' : 'not-completed'
                  } ${day.isToday ? 'today' : ''}`}
                  style={done ? { backgroundColor: habit.color } : {}}
                  title={`${day.label}: ${done ? 'Done' : 'Not done'}`}
                  onClick={() => onToggleDay(habit.id, day.key)}
                />
              </div>
            );
          })}
        </div>

        <button
          className={`check-btn ${todayDone ? 'checked' : ''}`}
          onClick={() => onToggleDay(habit.id, todayKey)}
        >
          {todayDone ? '✅ Completed today!' : '○ Mark today as done'}
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Delete Habit</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Are you sure you want to delete &quot;{habit.name}&quot;? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => {
                  onDelete(habit.id);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Habit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                className="form-input"
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEdit()}
                placeholder="Habit name"
                style={{ width: '100%', minWidth: 0 }}
              />
              <select
                className="color-select"
                value={editColor}
                onChange={e => setEditColor(e.target.value)}
                style={{ width: '100%' }}
              >
                {COLOR_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
