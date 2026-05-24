import { NextResponse } from 'next/server';

function getMetaContent(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return '';
}

function getTitleFromHtml(html: string) {
  const og = getMetaContent(html, 'og:title');
  if (og) return og;
  const tw = getMetaContent(html, 'twitter:title');
  if (tw) return tw;
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return (m?.[1] ?? '').replace(/\s+/g, ' ').trim();
}

function getImageFromHtml(html: string) {
  const og = getMetaContent(html, 'og:image');
  if (og) return og;
  const tw = getMetaContent(html, 'twitter:image');
  if (tw) return tw;
  return '';
}

function getFirstImageFromHtml(html: string) {
  const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  let count = 0;
  for (const m of matches) {
    count += 1;
    if (count > 80) break;
    const src = (m[1] ?? '').trim();
    const lower = src.toLowerCase();
    if (!src) continue;
    if (lower.startsWith('data:')) continue;
    if (lower.endsWith('.svg')) continue;
    if (lower.includes('favicon')) continue;
    if (lower.includes('logo')) continue;
    if (lower.includes('icon')) continue;
    return src;
  }
  return '';
}

function isPrivateOrLocalHostname(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  if (h === '0.0.0.0' || h === '127.0.0.1' || h === '::1') return true;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = (searchParams.get('url') ?? '').trim();
  if (!raw) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    return NextResponse.json({ error: 'invalid url protocol' }, { status: 400 });
  }

  if (isPrivateOrLocalHostname(u.hostname)) {
    return NextResponse.json({ error: 'blocked hostname' }, { status: 400 });
  }

  try {
    const res = await fetch(u.toString(), {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; JWDNewsBot/1.0)',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
    }

    const html = await res.text();
    const title = getTitleFromHtml(html);
    const imageRaw = getImageFromHtml(html) || getFirstImageFromHtml(html);
    let image = '';
    if (imageRaw) {
      try {
        image = new URL(imageRaw, u).toString();
      } catch {
        image = '';
      }
    }

    return NextResponse.json(
      { title, image },
      {
        headers: {
          'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'fetch error' }, { status: 502 });
  }
}
