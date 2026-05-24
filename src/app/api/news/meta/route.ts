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

function makeScreenshotUrl(u: URL) {
  return `https://image.thum.io/get/width/1200/${u.toString()}`;
}

function makeCardSvgDataUrl(opts: { title: string; host: string }) {
  const title = (opts.title || 'News').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const host = (opts.host || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#edf4e5"/>
      <stop offset="1" stop-color="#f7faf1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect x="48" y="48" width="1104" height="504" rx="28" fill="#ffffff" stroke="#c7d8b5"/>
  <text x="96" y="170" fill="#274126" font-size="46" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
  <text x="96" y="230" fill="#486449" font-size="28" font-family="Arial, Helvetica, sans-serif">${host}</text>
  <text x="96" y="500" fill="#486449" font-size="22" font-family="Arial, Helvetica, sans-serif">Click to open</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function thumLooksUsable(targetUrl: URL) {
  try {
    const thumb = makeScreenshotUrl(targetUrl);
    const res = await fetch(thumb, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(6000) });
    const code = Number(res.headers.get('thum_status_code') || '');
    if (Number.isFinite(code) && code >= 400) return false;
    return res.ok;
  } catch {
    return false;
  }
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

  const host = u.hostname.replace(/^www\./, '');

  try {
    const res = await fetch(u.toString(), {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; JWDNewsBot/1.0)',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error('fetch failed');

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
    if (!image) {
      image = (await thumLooksUsable(u)) ? makeScreenshotUrl(u) : makeCardSvgDataUrl({ title, host });
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
    const image = (await thumLooksUsable(u)) ? makeScreenshotUrl(u) : makeCardSvgDataUrl({ title: 'News', host });
    return NextResponse.json(
      { title: '', image },
      {
        headers: {
          'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  }
}
