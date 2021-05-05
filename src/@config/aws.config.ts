import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const awsValidationSchema = {
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_SMS_REGION: Joi.string().required(),
  AWS_SNS_REGION: Joi.string().required(),
  AWS_SNS_FROM: Joi.string().required(),
};

export default registerAs('CONFIG_AWS', () => ({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID,
  AWS_SMS_REGION: process.env.AWS_SMS_REGION,
  AWS_SNS_REGION: process.env.AWS_SNS_REGION,
  AWS_SNS_FROM: process.env.AWS_SNS_FROM,
}));
