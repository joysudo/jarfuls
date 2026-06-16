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
    name: 'PB',
    urlSuffix: 'pb',
    color: '#E2A33D',
    colorSoft: '#FBEBCB',
    mainQuest: 'Become a strong independent woman and a computer science nerd. We contain multitudes',
    pointGoal: 1000,
    emoji: '🥜',
  },
  {
    id: 'jam',
    name: 'J',
    urlSuffix: 'j',
    color: '#C4477B',
    colorSoft: '#F7DCE7',
    mainQuest: 'Build a source of passive income that will return at least $5 in the next century',
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
