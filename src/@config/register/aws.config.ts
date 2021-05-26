import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const awsConfigSchema = {
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_SMS_REGION: Joi.string().required(),
  AWS_SNS_REGION: Joi.string().required(),
  AWS_S3_REGION: Joi.string().required(),
  AWS_SNS_FROM: Joi.string().required(),
  AWS_BUCKET: Joi.string().required(),
};

export default registerAs('CONFIG_AWS', () => ({
  AWS_ACCESS_KEY_ID: 'AKIAS6ZWYN65LIC3735Z',
  AWS_SECRET_ACCESS_KEY: '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',
  AWS_SMS_REGION: process.env.AWS_SMS_REGION,
  AWS_SNS_REGION: process.env.AWS_SNS_REGION,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_SNS_FROM: process.env.AWS_SNS_FROM,
  AWS_BUCKET: process.env.AWS_BUCKET,
}));
