import { redis } from '../../configs/redis.config';

export class RedisService {
    async get<T>(key: string): Promise<T | null> {
        const value = await redis.get(key);
        if (!value) {
            return null;
        }
        try {
            return JSON.parse(value) as T;
        } catch (error) {
            console.error('Error parsing JSON for key', key, error);
            return null;
        }
    }

    async set<T>(key: string, value: T, expireInSeconds?: number): Promise<void> {
        const payload = JSON.stringify(value);
        if (expireInSeconds) {
            await redis.set(key, payload, 'EX', expireInSeconds);
        } else {
            await redis.set(key, payload);
        }
    }

    async setRaw(key: string, value: string, expireInSeconds?: number): Promise<void> {
        if (expireInSeconds) {
            await redis.set(key, value, 'EX', expireInSeconds);
        } else {
            await redis.set(key, value);
        }
    }

    async del(key: string): Promise<number> {
        return redis.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const res = await redis.exists(key);
        return res === 1;
    }

    async expire(key: string, seconds: number): Promise<boolean> {
        const res = await redis.expire(key, seconds);
        return res === 1;
    }

    async lpush<T>(key: string, ...values: T[]): Promise<number> {
        const serialized = values.map((v) => JSON.stringify(v));
        return redis.lpush(key, ...serialized);
    }

    async rpush<T>(key: string, ...values: T[]): Promise<number> {
        const serialized = values.map((v) => JSON.stringify(v));
        return redis.rpush(key, ...serialized);
    }

    async lrange<T>(key: string, start = 0, stop = -1): Promise<T[]> {
        const arr = await redis.lrange(key, start, stop);
        try {
            return arr.map((v) => JSON.parse(v) as T);
        } catch (error) {
            return arr as unknown as T[];
        }
    }

    async lpop<T>(key: string): Promise<T | null> {
        const v = await redis.lpop(key);
        if (!v) return null;
        try {
            return JSON.parse(v) as T;
        } catch {
            return null;
        }
    }

    async rpop<T>(key: string): Promise<T | null> {
        const v = await redis.rpop(key);
        if (!v) return null;
        try {
            return JSON.parse(v) as T;
        } catch {
            return null;
        }
    }

    async incr(key: string): Promise<number> {
        return redis.incr(key);
    }

    async decr(key: string): Promise<number> {
        return redis.decr(key);
    }
}

export const redisService = new RedisService();
