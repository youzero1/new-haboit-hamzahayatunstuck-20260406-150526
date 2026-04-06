'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Habit, WeekDay } from '@/lib/habits';

interface Props {
  habits: Habit[];
  weekDays: WeekDay[];
}

interface ChartEntry {
  day: string;
  completed: number;
  total: number;
}

export default function WeeklyChart({ habits, weekDays }: Props) {
  const data: ChartEntry[] = weekDays.map(day => ({
    day: day.label,
    completed: habits.filter(h => h.completedDays[day.key]).length,
    total: habits.length
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="day"
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#e2e8f0'
          }}
          labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          formatter={(value: number, name: string) => [
            value,
            name === 'completed' ? 'Completed' : 'Total Habits'
          ]}
        />
        <Legend
          wrapperStyle={{ color: '#64748b', fontSize: '12px' }}
          formatter={(value: string) =>
            value === 'completed' ? 'Completed' : 'Total Habits'
          }
        />
        <Bar dataKey="total" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
