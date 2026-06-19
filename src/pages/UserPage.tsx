import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getUserByUrlSuffix } from '../data/users';
import { useAppData } from '../lib/AppDataContext';
import PasswordGate from '../components/PasswordGate';
import VerticalJarBar from '../components/VerticalJarBar';
import ProjectsList from '../components/ProjectsList';
import ActivityGrid from '../components/ActivityGrid';
import LogActivityModal from '../components/LogActivityModal';
import { timeBasedActivities, fixedRewardActivities, fixedDetractorActivities } from '../activities';
import { totalHours, totalPoints, mainQuestPoints, jarFillPercent } from '../lib/points';
import type { Activity } from '../types/activities';
import './UserPage.css';

export default function UserPage() {
  const { suffix } = useParams<{ suffix: string }>();
  const user = getUserByUrlSuffix(suffix ?? '');
  const { logEntries, projects, loading, error } = useAppData();
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);

  const userEntries = useMemo(
    () => logEntries.filter((e) => user && e.user === user.id),
    [logEntries, user]
  );

  const userProjects = useMemo(
    () => projects.filter((p) => user && p.user === user.id),
    [projects, user]
  );

  if (!user) {
    return (
      <div className="user-page">
        <p className="user-page__state">No jar found for "{suffix}".</p>
      </div>
    );
  }

  const [todo, setTodo] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('todo');
    if (saved) setTodo(saved);
  }, []);
  const handleTodoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTodo(value);
    localStorage.setItem('todo', value);
    e.target.style.height = "";e.target.style.height = e.target.scrollHeight + 3 + "px";

  }

  const points = totalPoints(userEntries, user.id);
  const hours = totalHours(userEntries, user.id);
  const questPoints = mainQuestPoints(userEntries, user.id);
  const percent = jarFillPercent(points, user.pointGoal);

  return (
    <PasswordGate user={user} key={user.id}>
      <div
        className="user-page"
        style={{ '--accent-color': user.color, '--accent-soft': user.colorSoft } as React.CSSProperties}
      >
        <div className="user-page__header">
          <VerticalJarBar percent={percent} color={user.color} />
          <div className="user-page__info">
            <h1 className="user-page__name">
              <span aria-hidden="true">{user.emoji}</span> {user.name}
            </h1>
            <div className="user-page__hours">
              {hours.toFixed(1)} hours logged · {Math.round(points)} / {user.pointGoal} pts
            </div>
            <div className="user-page__quest">
              <span className="user-page__quest-label">Main quest</span>
              {user.mainQuest}
              <div style={{ marginTop: 0, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
                {Math.round(questPoints)} pts toward quest
              </div>
            </div>
            {!loading && 
              <ProjectsList projects={userProjects} />
            }
          </div>
        </div>

        {loading && <p className="user-page__state">Loading your jar...</p>}
        {error && <p className="user-page__state">{error}</p>}

        {!loading && (
          <>

            <ActivityGrid
              title="Time-based"
              activities={timeBasedActivities}
              logEntries={userEntries}
              accentColor={user.color}
              onSelect={setActiveActivity}
            />

            <ActivityGrid
              title="Fixed rewards"
              activities={fixedRewardActivities}
              logEntries={userEntries}
              accentColor={user.color}
              onSelect={setActiveActivity}
            />

            <ActivityGrid
              title="Fixed detractors"
              activities={fixedDetractorActivities}
              logEntries={userEntries}
              accentColor={user.color}
              onSelect={setActiveActivity}
            />
          </>
        )}

        <h3 className="activity-section__title">Notes</h3>
        <div className="user-page__quest">
          <span className="user-page__quest-label">To-do</span>
          <textarea 
            value={todo} 
            onChange={handleTodoChange} 
            placeholder="You can type notes or enter your to-do list here. Data is saved to your local browser."
          />
        </div>

        {activeActivity && (
          <LogActivityModal
            activity={activeActivity}
            user={user.id}
            onClose={() => setActiveActivity(null)}
          />
        )}
      </div>
    </PasswordGate>
  );
}
