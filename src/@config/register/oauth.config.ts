import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const oauthConfigSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET_KEY: Joi.string().required(),
  GOOGLE_CALLBACK: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_SECRET_KEY: Joi.string().required(),
  KAKAO_CALLBACK: Joi.string().required(),
};

export default registerAs('CONFIG_OAUTH', () => ({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_SECRET_KEY: process.env.KAKAO_SECRET_KEY,
  KAKAO_CALLBACK: process.env.KAKAO_CALLBACK,
}));
