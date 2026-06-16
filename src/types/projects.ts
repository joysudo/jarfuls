export interface Project {
  id: string;
  name: string;
  user: 'pb' | 'jam';
  activityIds: string[];      // Which activities this project contains
  status: 'active' | 'completed' | 'abandoned';
  hoursLogged: number;
  createdAt: string;
}
