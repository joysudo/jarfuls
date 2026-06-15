import type { Activity } from '../types/activities';

// Fixed detractors: a flat (negative) point value per occurrence
export const fixedDetractorActivities: Activity[] = [
  {
    id: 'cry',
    name: 'Cry',
    type: 'fixed',
    points: -5,
    requiresProject: false,
    emoji: '😭',
  },
  {
    id: 'caught-lying',
    name: 'Caught lying',
    type: 'fixed',
    points: -10,
    requiresProject: false,
    emoji: '🤥',
  },
];
