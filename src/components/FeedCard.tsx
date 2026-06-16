import type { LogEntry } from '../types/logEntry';
import { getActivityById } from '../activities';
import { getUserById } from '../data/users';
import { formatEntryDate, formatEntryTime } from '../lib/feed';
import type { Project } from '../types/projects';
import './FeedCard.css';

interface FeedCardProps {
  entry: LogEntry;
  projects: Project[];
  /** show the calendar date (used for "this week" and later buckets) */
  showDate?: boolean;
}

export default function FeedCard({ entry, showDate, projects }: FeedCardProps) {
  const activity = getActivityById(entry.activityId);
  const user = getUserById(entry.user);
  if (!activity || !user) return null;

  const detailParts: string[] = [];
  if (entry.hours != null) detailParts.push(`${entry.hours.toFixed(1)}h`);
  if (entry.notes) detailParts.push(entry.notes);

  return (
    <div className="feed-card" style={{ '--accent-color': user.color } as React.CSSProperties}>
      <span className="feed-card__emoji" aria-hidden="true">{activity.emoji}</span>
      <div className="feed-card__body">
        <div className="feed-card__top">
          <span className={`feed-card__activity ${entry.completedProject ? 'feed-card__activity--done' : ''}`}>
            {activity.name}
          </span>
          <span className="feed-card__user">{user.name}</span>
          <span className="feed-card__date">
            {showDate ? formatEntryDate(entry.timestamp) : formatEntryTime(entry.timestamp)}
          </span>
        </div>
        <div className="feed-card__projects">
          {entry.projectIds?.map((projectId, i) => (
            <span className="feed-card__project-tag" key={i}>{projects.find(p => p.id === projectId)?.name}</span>
          ))}
        </div>
        {detailParts.length > 0 && (
          <div className="feed-card__detail">{detailParts.join(' · ')}</div>
        )}
      </div>
      <div
        className={`feed-card__points ${
          entry.pointsEarned < 0
            ? 'feed-card__points--negative'
            : entry.countsForMainQuest
              ? 'feed-card__points--quest'
              : ''
        }`}
      >
        {entry.pointsEarned > 0 ? '+' : ''}{entry.pointsEarned} pts
        {entry.countsForMainQuest ? ' ⭐' : ''}
      </div>
    </div>
  );
}
