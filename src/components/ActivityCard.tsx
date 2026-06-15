import type { Activity } from '../types/activities';
import './ActivityCard.css';

interface ActivityCardProps {
  activity: Activity;
  /** hours logged (for per_hour) or completion count (for fixed) */
  cornerValue: number;
  accentColor: string;
  onClick: () => void;
}

export default function ActivityCard({ activity, cornerValue, accentColor, onClick }: ActivityCardProps) {
  const pointsLabel =
    activity.type === 'per_hour'
      ? `${activity.points} pts / hr`
      : `${activity.points > 0 ? '+' : ''}${activity.points} pts`;

  const cornerLabel =
    activity.type === 'per_hour'
      ? `${cornerValue.toFixed(1)}h`
      : `${cornerValue}x`;

  return (
    <button
      type="button"
      className={`activity-card ${activity.points < 0 ? 'activity-card--detractor' : ''}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
      onClick={onClick}
    >
      {cornerValue > 0 && <span className="activity-card__corner">{cornerLabel}</span>}
      <span className="activity-card__emoji" aria-hidden="true">{activity.emoji}</span>
      <span className="activity-card__name">{activity.name}</span>
      <span className="activity-card__points">{pointsLabel}</span>
    </button>
  );
}
