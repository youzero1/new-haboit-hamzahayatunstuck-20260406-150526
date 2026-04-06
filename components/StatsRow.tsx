interface Props {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  weeklyRate: number;
}

export default function StatsRow({ totalHabits, completedToday, longestStreak, weeklyRate }: Props) {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-value">{totalHabits}</div>
        <div className="stat-label">Total Habits</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{completedToday}</div>
        <div className="stat-label">Done Today</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">🔥{longestStreak}</div>
        <div className="stat-label">Best Streak</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{weeklyRate}%</div>
        <div className="stat-label">Weekly Rate</div>
      </div>
    </div>
  );
}
