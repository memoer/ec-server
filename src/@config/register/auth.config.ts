import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const authConfigSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_SECRET_KEY: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_SECRET_KEY: Joi.string().required(),
  KAKAO_CALLBACK_URL: Joi.string().required(),
  FACEBOOK_CLIENT_ID: Joi.string().required(),
  FACEBOOK_SECRET_KEY: Joi.string().required(),
  FACEBOOK_CALLBACK_URL: Joi.string().required(),
};

export default registerAs('CONFIG_AUTH', () => ({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
  KAKAO_SECRET_KEY: process.env.KAKAO_SECRET_KEY,
  KAKAO_CALLBACK_URL: process.env.KAKAO_CALLBACK_URL,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_SECRET_KEY: process.env.FACEBOOK_SECRET_KEY,
  FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL,
}));
