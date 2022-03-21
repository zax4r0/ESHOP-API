import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  DATABASE_URL,
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SALT_WORKFACTOR,
  PUBLIC_KEY,
  PRIVATE_KEY,
  REFRESHTOKEN_TTL,
  ACCESSTOKEN_TTL,
} = process.env;
