import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { checkPassword, isAuthenticated, setAuthenticated, type UserId } from '../lib/auth';
import type { UserConfig } from '../data/users';
import './PasswordGate.css';

interface PasswordGateProps {
  user: UserConfig;
  children: ReactNode;
}

export default function PasswordGate({ user, children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(() => isAuthenticated(user.id as UserId));
  const [attempt, setAttempt] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(user.id as UserId, attempt)) {
      setAuthenticated(user.id as UserId);
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="gate">
      <form className="gate__card" onSubmit={handleSubmit}>
        <div className="gate__emoji" aria-hidden="true">{user.emoji}</div>
        <h1 className="gate__title">{user.name}'s jar</h1>
        <p className="gate__subtitle">Enter the password to log activities and view your jar.</p>
        <input
          className="modal__input"
          type="password"
          value={attempt}
          onChange={(e) => { setAttempt(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
        />
        {error && <div className="gate__error">That's not it — try again.</div>}
        <div style={{ marginTop: 16 }}>
          <button type="submit" className="modal__btn modal__btn--full">Unlock</button>
        </div>
        <Link to="/" className="gate__back">← Back to homepage</Link>
      </form>
    </div>
  );
}
