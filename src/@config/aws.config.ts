import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const awsValidationSchema = {
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
};

export default registerAs('CONFIG_AWS', () => ({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
}));
