import type { Activity } from '../types/activities';
import { timeBasedActivities } from './timeBased';
import { fixedRewardActivities } from './fixedRewards';
import { fixedDetractorActivities } from './fixedDetractors';

export { timeBasedActivities } from './timeBased';
export { fixedRewardActivities } from './fixedRewards';
export { fixedDetractorActivities } from './fixedDetractors';

export const allActivities: Activity[] = [
  ...timeBasedActivities,
  ...fixedRewardActivities,
  ...fixedDetractorActivities,
];

export function getActivityById(id: string): Activity | undefined {
  return allActivities.find((a) => a.id === id);
}
