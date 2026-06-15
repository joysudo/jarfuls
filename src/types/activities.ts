export interface Activity {
  id: string;             // stable identifier, used as activityName key
  name: string;            // display name, e.g. 'Read', 'Draw', 'Exercise'
  type: 'per_hour' | 'fixed';
  points: number;          // if per_hour: points x hours logged; if fixed: points per completion
  requiresProject: boolean;
  emoji: string;
}
