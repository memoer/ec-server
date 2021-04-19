import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import isEnv from 'src/lib/isEnv';

export const appValidationSchema = {
  NODE_ENV: Joi.string()
    .valid('test', 'local', 'development', 'staging', 'production')
    .required(),
  JWT_SECRET_KEY: Joi.string().required(),
  SENTRY_DSN: Joi.string().required(),
  ...(isEnv('prod') && {
    THROTTLER_TTL: Joi.number().required(),
    THROTTLER_LIMIT: Joi.number().required(),
  }),
  CORS_ORIGIN: Joi.string().required(),
};

export default registerAs('CONFIG_APP', () => ({
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SENTRY_DSN: process.env.SENTRY_DSN,
  THROTTLER_TTL: Number(process.env.THROTTLER_TTL),
  THROTTLER_LIMIT: Number(process.env.THROTTLER_LIMIT),
  CORS_ORIGIN: process.env.CORS_ORIGIN,
}));
