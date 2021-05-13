import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const dbConfigSchema = {
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_PORT: Joi.number().required(),
  TYPEORM_CACHE_TTL: Joi.number().required(),
};

export default registerAs('CONFIG_DB', () => ({
  type: 'postgres',
  TYPEORM_HOST: process.env.TYPEORM_HOST,
  TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
  TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD,
  TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
  TYPEORM_PORT: +process.env.TYPEORM_PORT,
  TYPEORM_CACHE_TTL: +process.env.TYPEORM_CACHE_TTL,
}));
