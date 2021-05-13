import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const redisConfigSchema = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
};

export default registerAs('CONFIG_REDIS', () => ({
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: +process.env.REDIS_PORT,
}));
