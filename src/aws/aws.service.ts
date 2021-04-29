import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SNS } from 'aws-sdk';
import awsConfig from '~/@config/aws.config';
import { IAwsService, SendSMS } from './aws.interface';

@Injectable()
export class AwsService implements IAwsService {
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
  async sendSMS(args: SendSMS['args']) {
    return this._sns.publish(args).promise();
  }
}
