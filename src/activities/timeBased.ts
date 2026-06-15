import type { Activity } from '../types/activities';

// Time-based activities: points = points-per-hour x hours logged
export const timeBasedActivities: Activity[] = [
  {
    id: 'code',
    name: 'Code',
    type: 'per_hour',
    points: 2,
    requiresProject: true,
    emoji: '💻',
  },
  {
    id: 'art-craft',
    name: 'Art/Craft',
    type: 'per_hour',
    points: 2,
    requiresProject: true,
    emoji: '🎨',
  },
  {
    id: 'read',
    name: 'Read',
    type: 'per_hour',
    points: 2,
    requiresProject: true,
    emoji: '📖',
  },
  {
    id: 'workout',
    name: 'Workout',
    type: 'per_hour',
    points: 2,
    requiresProject: false,
    emoji: '💪',
  },
  {
    id: 'wake-tech',
    name: 'Wake Tech',
    type: 'per_hour',
    points: 2,
    requiresProject: false,
    emoji: '🏫',
  },
  {
    id: 'meeting',
    name: 'Meeting',
    type: 'per_hour',
    points: 2,
    requiresProject: false,
    emoji: '🤝',
  },
  {
    id: 'volunteer',
    name: 'Volunteer',
    type: 'per_hour',
    points: 2,
    requiresProject: false,
    emoji: '🫶',
  },
  {
    id: 'journal',
    name: 'Journal',
    type: 'per_hour',
    points: 2,
    requiresProject: false,
    emoji: '✍️',
  }
];