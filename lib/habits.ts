export interface Habit {
  id: string;
  name: string;
  color: string;
  completedDays: Record<string, boolean>;
  createdAt: string;
}

export interface WeekDay {
  key: string;
  label: string;
  short: string;
  isToday: boolean;
}

export function getDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekDays(): WeekDay[] {
  const days: WeekDay[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayKey = getDayKey(today);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = getDayKey(d);
    days.push({
      key,
      label: dayNames[i],
      short: dayNames[i].charAt(0),
      isToday: key === todayKey
    });
  }
  return days;
}

export function getCurrentStreak(habit: Habit): number {
  let streak = 0;
  const today = new Date();
  const d = new Date(today);

  while (true) {
    const key = getDayKey(d);
    if (habit.completedDays[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getCompletionRate(habit: Habit, weekDays: WeekDay[]): number {
  const completed = weekDays.filter(d => habit.completedDays[d.key]).length;
  return Math.round((completed / 7) * 100);
}
