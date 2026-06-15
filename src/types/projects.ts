export interface Project {
  id: string;
  name: string;
  user: 'pb' | 'jam';
  activityId: string;      // Which activity this project belongs to (e.g., 'draw' projects only show for draw)
  status: 'active' | 'completed' | 'abandoned';
  hoursLogged: number;
  createdAt: string;
}
