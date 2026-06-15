import { useMemo } from 'react';
import { USERS } from '../data/users';
import { useAppData } from '../lib/AppDataContext';
import Jar from '../components/Jar';
import FeedCard from '../components/FeedCard';
import { totalHours, totalPoints, mainQuestPoints, jarFillPercent } from '../lib/points';
import { groupEntriesForFeed } from '../lib/feed';
import './HomePage.css';
import '../components/FeedCard.css';

export default function HomePage() {
  const { logEntries, loading, error } = useAppData();

  const feedGroups = useMemo(() => groupEntriesForFeed(logEntries), [logEntries]);

  return (
    <div className="home-page">
      <div className="home-page__jars">
        {USERS.map((user) => {
          const userEntries = logEntries.filter((e) => e.user === user.id);
          const points = totalPoints(userEntries, user.id);
          const hours = totalHours(userEntries, user.id);
          const questPoints = mainQuestPoints(userEntries, user.id);
          const percent = jarFillPercent(points, user.pointGoal);

          return (
            <Jar
              key={user.id}
              name={user.name}
              emoji={user.emoji}
              color={user.color}
              colorSoft={user.colorSoft}
              points={points}
              percent={percent}
              hours={hours}
              mainQuestPoints={questPoints}
              mainQuest={user.mainQuest}
            />
          );
        })}
      </div>

      <h2 className="home-page__feed-title">Activity feed</h2>

      {loading && <p className="home-page__state">Loading the feed...</p>}
      {error && <p className="home-page__state">{error}</p>}

      {!loading && feedGroups.length === 0 && (
        <p className="home-page__state">Nothing logged yet — the jars are waiting to fill up!</p>
      )}

      {!loading &&
        feedGroups.map((group) => (
          <section key={group.bucket} className="feed-section">
            <h3 className="feed-section__title">{group.label}</h3>
            <div className="feed-list">
              {group.entries.map((entry) => (
                <FeedCard
                  key={entry.id}
                  entry={entry}
                  showDate={group.bucket !== 'today' && group.bucket !== 'yesterday'}
                />
              ))}
            </div>
          </section>
        ))}
    </div>
  );
}
