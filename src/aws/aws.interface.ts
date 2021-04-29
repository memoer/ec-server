import { PromiseResult } from 'aws-sdk/lib/request';

export interface SendSMS {
  args: {
    Message: string;
    PhoneNumber: string;
  };
}
export interface IAwsService {
  sendSMS(
    args: SendSMS['args'],
  ): Promise<PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>>;
}
