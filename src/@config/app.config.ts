import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import isEnv from '~/lib/isEnv';

export const appValidationSchema = {
  SERVER_PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('test', 'local', 'development', 'staging', 'production')
    .required(),
  JWT_SECRET_KEY: Joi.number().required(),
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
  JWT_SECRET_KEY: +process.env.JWT_SECRET_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CSRF_MAX_AGE: +process.env.CSRF_MAX_AGE,
  THROTTLER_TTL: +process.env.THROTTLER_TTL,
  THROTTLER_LIMIT: +process.env.THROTTLER_LIMIT,
}));
