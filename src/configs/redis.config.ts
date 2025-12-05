import Redis from 'ioredis';
import { appEnv } from './app.config';

export const redis = new Redis({
  host: appEnv.REDIS_HOST,
  port: appEnv.REDIS_PORT,
});

redis.on('connect', () => {
  console.log('Connected to Redis server');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});