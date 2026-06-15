import type { Activity } from '../types/activities';

// Time-based activities: points = points-per-hour x hours logged
export const timeBasedActivities: Activity[] = [
  {
    id: 'read',
    name: 'Read',
    type: 'per_hour',
    points: 10,
    requiresProject: true,
    emoji: '📖',
  },
  {
    id: 'draw',
    name: 'Draw',
    type: 'per_hour',
    points: 12,
    requiresProject: true,
    emoji: '🎨',
  },
  {
    id: 'exercise',
    name: 'Exercise',
    type: 'per_hour',
    points: 15,
    requiresProject: false,
    emoji: '🏃',
  },
  {
    id: 'code',
    name: 'Code',
    type: 'per_hour',
    points: 10,
    requiresProject: true,
    emoji: '💻',
  },
  {
    id: 'work',
    name: 'Work',
    type: 'per_hour',
    points: 8,
    requiresProject: false,
    emoji: '🧾',
  },
];
