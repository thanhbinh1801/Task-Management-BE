import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly, url } from 'envalid';

dotenv.config();

export const appEnv = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  DATABASE_URL: str(),
  // OAuth / JWT
  JWT_SECRET: str(),
  SESSION_SECRET: str(),
  GOOGLE_CLIENT_ID: str({ default: '' }),
  GOOGLE_CLIENT_SECRET: str({ default: '' }),
  GOOGLE_CALLBACK_URL: str({ default: 'http://localhost:8000/api/v1/auth/google/callback' }),
});