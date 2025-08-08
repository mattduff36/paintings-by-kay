import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/admin')) {
    const session = request.cookies.get('admin_session')?.value;
    if (session !== '1') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};


