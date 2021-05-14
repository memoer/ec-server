import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const authConfigSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET_KEY: Joi.string().required(),
  GOOGLE_CALLBACK: Joi.string().required(),
};

export default registerAs('CONFIG_AUTH', () => ({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
}));
