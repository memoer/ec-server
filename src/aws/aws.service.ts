import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import { awsConfig } from '~/@config/register';
import { SendEmail, SendSMS } from './aws.interface';

@Injectable()
export class AwsService {
  private _sns;
  private _transporter;
  private _s3;
  constructor(
    @Inject(awsConfig.KEY)
    private readonly _awsConfig: ConfigType<typeof awsConfig>,
  ) {
    this._sns = new aws.SNS({
      apiVersion: '2010-03-31',
      region: this._awsConfig.AWS_SMS_REGION,
    });
    this._transporter = nodemailer.createTransport({
      SES: {
        ses: new aws.SES({
          apiVersion: '2010-12-01',
          region: this._awsConfig.AWS_SNS_REGION,
        }),
        aws,
      },
    });
    this._s3 = new aws.S3({
      apiVersion: '2006-03-01',
      region: this._awsConfig.AWS_S3_REGION,
    });
  }

  async sendSMS(args: SendSMS) {
    return this._sns.publish(args).promise();
  }

  async sendEmail(args: SendEmail) {
    return this._transporter.sendMail({
      from: this._awsConfig.AWS_SNS_FROM,
      ...args,
    });
  }

  async uploadToS3(args: Omit<aws.S3.PutObjectRequest, 'Bucket'>) {
    const params: aws.S3.PutObjectRequest = {
      Bucket: this._awsConfig.AWS_BUCKET,
      ...args,
    };
    return this._s3.upload(params).promise();
  }

  async deleteFromS3(args: Omit<aws.S3.Types.DeleteObjectRequest, 'Bucket'>) {
    const params: aws.S3.Types.DeleteObjectRequest = {
      Bucket: this._awsConfig.AWS_BUCKET,
      ...args,
    };
    return this._s3.deleteObject(params).promise();
  }
}
