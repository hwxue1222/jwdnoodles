import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

type StockState = {
  inventory: unknown[];
  transactions: unknown[];
  updatedAt: number;
};

const STATE_KEY = 'stock:state:v1';

const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? '';
  if (!url || !token) return null;
  return new Redis({ url, token });
};

export async function GET() {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ ok: false, error: 'CLOUD_NOT_CONFIGURED' }, { status: 501 });
    }

    const state = await redis.get<StockState>(STATE_KEY);
    return NextResponse.json({ ok: true, state: state ?? null });
  } catch {
    return NextResponse.json({ ok: false, error: 'CLOUD_ERROR' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const redis = getRedis();
    if (!redis) {
      return NextResponse.json({ ok: false, error: 'CLOUD_NOT_CONFIGURED' }, { status: 501 });
    }

    const body = (await req.json()) as Partial<StockState>;
    const inventory = Array.isArray(body.inventory) ? body.inventory : null;
    const transactions = Array.isArray(body.transactions) ? body.transactions : null;
    const updatedAt = typeof body.updatedAt === 'number' && Number.isFinite(body.updatedAt) ? body.updatedAt : null;

    if (!inventory || !transactions || updatedAt === null) {
      return NextResponse.json({ ok: false, error: 'BAD_REQUEST' }, { status: 400 });
    }

    const current = await redis.get<StockState>(STATE_KEY);
    if (current && typeof current.updatedAt === 'number' && current.updatedAt > updatedAt) {
      return NextResponse.json({ ok: false, error: 'STALE_WRITE', state: current }, { status: 409 });
    }

    const next: StockState = { inventory, transactions, updatedAt };
    await redis.set(STATE_KEY, next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'CLOUD_ERROR' }, { status: 500 });
  }
}
