import type { Activity } from '../types/activities';
import type { LogEntry } from '../types/logEntry';
import ActivityCard from './ActivityCard';
import './ActivityGrid.css';

interface ActivityGridProps {
  title: string;
  activities: Activity[];
  logEntries: LogEntry[];
  accentColor: string;
  onSelect: (activity: Activity) => void;
}

export default function ActivityGrid({ title, activities, logEntries, accentColor, onSelect }: ActivityGridProps) {
  return (
    <section className="activity-section">
      <h3 className="activity-section__title">{title}</h3>
      <div className="activity-grid">
        {activities.map((activity) => {
          const relevant = logEntries.filter((e) => e.activityId === activity.id);
          const cornerValue =
            activity.type === 'per_hour'
              ? relevant.reduce((sum, e) => sum + (e.hours ?? 0), 0)
              : relevant.length;

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              cornerValue={cornerValue}
              accentColor={accentColor}
              onClick={() => onSelect(activity)}
            />
          );
        })}
      </div>
    </section>
  );
}
