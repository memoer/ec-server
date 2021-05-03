import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import isEnv from '~/_lib/isEnv';

export const appValidationSchema = {
  SERVER_PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('test', 'local', 'development', 'staging', 'production')
    .required(),
  JWT_PRIVATE_KEY: Joi.string().required(),
  HASH_SALT_OR_ROUND: Joi.number().required(),
  SENTRY_DSN: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required(),
  CSRF_MAX_AGE: Joi.number().required(),
  ...(isEnv('prod') && {
    THROTTLER_TTL: Joi.number().required(),
    THROTTLER_LIMIT: Joi.number().required(),
  }),
};

export default registerAs('CONFIG_APP', () => ({
  SERVER_PORT: +process.env.SERVER_PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  HASH_SALT_OR_ROUND: +process.env.HASH_SALT_OR_ROUND,
  SENTRY_DSN: process.env.SENTRY_DSN,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CSRF_MAX_AGE: +process.env.CSRF_MAX_AGE,
  THROTTLER_TTL: +process.env.THROTTLER_TTL,
  THROTTLER_LIMIT: +process.env.THROTTLER_LIMIT,
}));
