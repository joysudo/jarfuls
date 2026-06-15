import { Link, useLocation } from 'react-router';
import { USERS } from '../data/users';
import './Header.css';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <span aria-hidden="true">🫙</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Jarfuls</span>
      </Link>
      <nav className="header__nav" aria-label="Main">
        {USERS.map((user) => {
          const path = `/${user.urlSuffix}`;
          const active = location.pathname === path;
          return (
            <Link
              key={user.id}
              to={path}
              className={`header__link header__link--${user.id} ${active ? 'header__link--active' : ''}`}
            >
              {user.emoji} {user.name}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
