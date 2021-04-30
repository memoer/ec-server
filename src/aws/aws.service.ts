import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import awsConfig from '~/@config/aws.config';
import { SendSMS } from './aws.interface';

@Injectable()
export class AwsService {
  private _sns;
  constructor(
    @Inject(awsConfig.KEY)
    private readonly _awsConfig: ConfigType<typeof awsConfig>,
  ) {
    this._sns = new SNS({
      apiVersion: '2010-03-31',
      region: this._awsConfig.AWS_SMS_REGION,
    });
  }
  //
  async sendSMS(args: SendSMS) {
    return this._sns.publish(args).promise();
  }
}
