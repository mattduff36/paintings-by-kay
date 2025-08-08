import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = body?.password as string | undefined;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
  }
  setAdminSession();
  return NextResponse.json({ ok: true });
}


