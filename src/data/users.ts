export interface UserConfig {
  id: 'pb' | 'jam';
  name: string;
  urlSuffix: string;       // e.g. 'pb' -> /pb
  color: string;           // hex color for this user's jar / accents
  colorSoft: string;       // softer tint for backgrounds
  mainQuest: string;       // freeform text describing the main quest
  pointGoal: number;       // points needed for a full jar
  emoji: string;
}

export const USERS: UserConfig[] = [
  {
    id: 'pb',
    name: 'Peanut Butter',
    urlSuffix: 'pb',
    color: '#E2A33D',
    colorSoft: '#FBEBCB',
    mainQuest: 'Build the habit of showing up every day, one small jarful at a time.',
    pointGoal: 1000,
    emoji: '🥜',
  },
  {
    id: 'jam',
    name: 'Jam',
    urlSuffix: 'j',
    color: '#C4477B',
    colorSoft: '#F7DCE7',
    mainQuest: 'Build the habit of showing up every day, one small jarful at a time.',
    pointGoal: 1000,
    emoji: '🍓',
  },
];

export function getUserById(id: string): UserConfig | undefined {
  return USERS.find((u) => u.id === id);
}

export function getUserByUrlSuffix(suffix: string): UserConfig | undefined {
  return USERS.find((u) => u.urlSuffix === suffix);
}
