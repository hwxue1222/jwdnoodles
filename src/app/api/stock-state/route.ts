import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { createClient, type RedisClientType } from 'redis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type StockState = {
  inventory: unknown[];
  transactions: unknown[];
  updatedAt: number;
};

const STATE_KEY = 'stock:state:v1';

type StateStore = {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<void>;
};

let nodeRedisClientPromise: Promise<RedisClientType> | null = null;
const getNodeRedisClient = async () => {
  if (nodeRedisClientPromise) return nodeRedisClientPromise;
  const url = process.env.REDIS_URL ?? '';
  if (!url) return null;

  nodeRedisClientPromise = (async () => {
    const client: RedisClientType = createClient({ url });
    await client.connect();
    return client;
  })();

  try {
    return await nodeRedisClientPromise;
  } catch {
    nodeRedisClientPromise = null;
    return null;
  }
};

const getStore = async (): Promise<StateStore | null> => {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? '';
  if (url && token) {
    const redis = new Redis({ url, token });
    return {
      get: async <T,>(key: string) => (await redis.get<T>(key)) ?? null,
      set: async (key: string, value: unknown) => {
        await redis.set(key, value);
      },
    };
  }

  const nodeRedis = await getNodeRedisClient();
  if (!nodeRedis) return null;
  return {
    get: async <T,>(key: string) => {
      const raw = await nodeRedis.get(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    set: async (key: string, value: unknown) => {
      await nodeRedis.set(key, JSON.stringify(value));
    },
  };
};

export async function GET() {
  try {
    const store = await getStore();
    if (!store) {
      return NextResponse.json({ ok: false, error: 'CLOUD_NOT_CONFIGURED' }, { status: 501 });
    }

    const state = await store.get<StockState>(STATE_KEY);
    return NextResponse.json({ ok: true, state: state ?? null });
  } catch {
    return NextResponse.json({ ok: false, error: 'CLOUD_ERROR' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const store = await getStore();
    if (!store) {
      return NextResponse.json({ ok: false, error: 'CLOUD_NOT_CONFIGURED' }, { status: 501 });
    }

    const body = (await req.json()) as Partial<StockState>;
    const inventory = Array.isArray(body.inventory) ? body.inventory : null;
    const transactions = Array.isArray(body.transactions) ? body.transactions : null;
    const updatedAt = typeof body.updatedAt === 'number' && Number.isFinite(body.updatedAt) ? body.updatedAt : null;

    if (!inventory || !transactions || updatedAt === null) {
      return NextResponse.json({ ok: false, error: 'BAD_REQUEST' }, { status: 400 });
    }

    const current = await store.get<StockState>(STATE_KEY);
    if (current && typeof current.updatedAt === 'number' && current.updatedAt > updatedAt) {
      return NextResponse.json({ ok: false, error: 'STALE_WRITE', state: current }, { status: 409 });
    }

    const next: StockState = { inventory, transactions, updatedAt };
    await store.set(STATE_KEY, next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'CLOUD_ERROR' }, { status: 500 });
  }
}
