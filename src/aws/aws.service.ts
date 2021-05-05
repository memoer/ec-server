import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import awsConfig from '~/@config/aws.config';
import { SendEmail, SendSMS } from './aws.interface';

@Injectable()
export class AwsService {
  private _sns;
  private _transporter;
  constructor(
    @Inject(awsConfig.KEY)
    private readonly _awsConfig: ConfigType<typeof awsConfig>,
  ) {
    this._sns = new aws.SNS({
      apiVersion: '2010-03-31',
      region: this._awsConfig.AWS_SMS_REGION,
    });
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: this._awsConfig.AWS_SNS_REGION,
    });
    this._transporter = nodemailer.createTransport({
      SES: { ses, aws },
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
}
