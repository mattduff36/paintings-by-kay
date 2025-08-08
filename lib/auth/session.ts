import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';

export function isAdminAuthenticated(): boolean {
  const store = cookies();
  const val = store.get(COOKIE_NAME)?.value;
  return val === '1';
}

export function setAdminSession() {
  const store = cookies();
  store.set(COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
}

export function clearAdminSession() {
  const store = cookies();
  store.delete(COOKIE_NAME);
}


