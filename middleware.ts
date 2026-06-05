import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.jwdnoodles.com';

export function middleware(req: NextRequest) {
  if (process.env.VERCEL_ENV !== 'production') return NextResponse.next();

  const headers = req.headers;
  const forwardedHost = headers.get('x-forwarded-host');
  const host = (forwardedHost ?? headers.get('host') ?? '').split(',')[0]?.trim().toLowerCase();
  const proto = (headers.get('x-forwarded-proto') ?? 'https').split(',')[0]?.trim().toLowerCase();

  if (!host) return NextResponse.next();
  if (host.includes('localhost') || host.startsWith('127.0.0.1')) return NextResponse.next();
  if (host.endsWith('.vercel.app')) return NextResponse.next();

  const needsHostRedirect = host !== CANONICAL_HOST;
  const needsHttpsRedirect = proto !== 'https';

  if (!needsHostRedirect && !needsHttpsRedirect) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml).*)'],
};

