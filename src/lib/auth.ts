export type UserId = 'pb' | 'jam';

const SESSION_KEY_PREFIX = 'jarfuls_auth_';

const PASSWORDS: Record<UserId, string | undefined> = {
  pb: import.meta.env.VITE_PB_PASSWORD as string | undefined,
  jam: import.meta.env.VITE_JAM_PASSWORD as string | undefined,
};

export function isAuthenticated(userId: UserId): boolean {
  return sessionStorage.getItem(SESSION_KEY_PREFIX + userId) === 'true';
}

export function setAuthenticated(userId: UserId): void {
  sessionStorage.setItem(SESSION_KEY_PREFIX + userId, 'true');
}

export function clearAuthenticated(userId: UserId): void {
  sessionStorage.removeItem(SESSION_KEY_PREFIX + userId);
}

/**
 * Check a submitted password against the configured env value for this user.
 * Returns false (and logs a warning) if no password is configured.
 */
export function checkPassword(userId: UserId, attempt: string): boolean {
  const expected = PASSWORDS[userId];
  if (!expected) {
    console.warn(
      `No password configured for "${userId}". Set VITE_${userId.toUpperCase()}_PASSWORD in .env.`
    );
    return false;
  }
  return attempt === expected;
}
