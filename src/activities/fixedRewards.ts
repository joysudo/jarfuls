import type { Activity } from '../types/activities';

// Fixed rewards: a flat point value per completion
export const fixedRewardActivities: Activity[] = [
  {
    id: 'paint-nails',
    name: 'Paint nails',
    type: 'fixed',
    points: 5,
    requiresProject: false,
    emoji: '💅',
  },
  {
    id: 'pool-day',
    name: 'Pool day',
    type: 'fixed',
    points: 15,
    requiresProject: false,
    emoji: '🏊',
  },
  {
    id: 'apply-for-job',
    name: 'Apply for a job',
    type: 'fixed',
    points: 20,
    requiresProject: false,
    emoji: '📨',
  },
  {
    id: 'go-to-theater',
    name: 'Go to the theater',
    type: 'fixed',
    points: 10,
    requiresProject: false,
    emoji: '🎭',
  },
  {
    id: 'morning-stretch',
    name: 'Morning stretch',
    type: 'fixed',
    points: 5,
    requiresProject: false,
    emoji: '🧘',
  },
];
