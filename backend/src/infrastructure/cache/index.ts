import { config } from "../../config/index.js";
import { appLogger } from "../logger/index.js";

export type CacheNamespace = "session" | "knowledge" | "ai-response";

interface CacheEntry {
  value: string;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry>();

const namespaceTtl: Record<CacheNamespace, number> = {
  session: config.cache.sessionTtlSeconds,
  knowledge: config.cache.knowledgeTtlSeconds,
  "ai-response": config.cache.aiResponseTtlSeconds,
};

const buildKey = (namespace: CacheNamespace, key: string): string =>
  `sarathi:${namespace}:${key}`;

export interface CacheAdapter {
  get(namespace: CacheNamespace, key: string): Promise<string | null>;
  set(namespace: CacheNamespace, key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(namespace: CacheNamespace, key: string): Promise<void>;
  flush(namespace?: CacheNamespace): Promise<void>;
}

class MemoryCacheAdapter implements CacheAdapter {
  async get(namespace: CacheNamespace, key: string): Promise<string | null> {
    const fullKey = buildKey(namespace, key);
    const entry = memoryStore.get(fullKey);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryStore.delete(fullKey);
      return null;
    }
    return entry.value;
  }

  async set(
    namespace: CacheNamespace,
    key: string,
    value: string,
    ttlSeconds?: number
  ): Promise<void> {
    const ttl = (ttlSeconds ?? namespaceTtl[namespace]) * 1000;
    memoryStore.set(buildKey(namespace, key), {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  async del(namespace: CacheNamespace, key: string): Promise<void> {
    memoryStore.delete(buildKey(namespace, key));
  }

  async flush(namespace?: CacheNamespace): Promise<void> {
    if (!namespace) {
      memoryStore.clear();
      return;
    }
    const prefix = `sarathi:${namespace}:`;
    for (const k of memoryStore.keys()) {
      if (k.startsWith(prefix)) memoryStore.delete(k);
    }
  }
}

/** Redis-ready cache — uses in-memory adapter until REDIS_URL is wired. */
class RedisReadyCacheAdapter implements CacheAdapter {
  private readonly fallback = new MemoryCacheAdapter();
  private redisClient: CacheAdapter | null = null;

  constructor() {
    if (config.redis.enabled) {
      appLogger.info("Redis URL configured — using in-memory cache with Redis-ready interface", {
        url: config.redis.url.replace(/\/\/.*@/, "//***@"),
      });
      // Future: instantiate ioredis client here when dependency is added
    }
  }

  private adapter(): CacheAdapter {
    return this.redisClient ?? this.fallback;
  }

  get(namespace: CacheNamespace, key: string): Promise<string | null> {
    return this.adapter().get(namespace, key);
  }

  set(
    namespace: CacheNamespace,
    key: string,
    value: string,
    ttlSeconds?: number
  ): Promise<void> {
    return this.adapter().set(namespace, key, value, ttlSeconds);
  }

  del(namespace: CacheNamespace, key: string): Promise<void> {
    return this.adapter().del(namespace, key);
  }

  flush(namespace?: CacheNamespace): Promise<void> {
    return this.adapter().flush(namespace);
  }
}

export const cache = new RedisReadyCacheAdapter();

export const cacheAiResponse = async (
  promptHash: string,
  response: string
): Promise<void> => cache.set("ai-response", promptHash, response);

export const getCachedAiResponse = async (
  promptHash: string
): Promise<string | null> => cache.get("ai-response", promptHash);
