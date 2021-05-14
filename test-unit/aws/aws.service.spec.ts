import { Test, TestingModule } from '@nestjs/testing';
import { awsConfig } from '~/@config/register';
import { AwsService } from '~/aws/aws.service';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';

const awsMock = {
  sns: {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  },
  ses: {},
  s3: {
    deleteObject: jest.fn().mockReturnThis(),
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  },
};
const createTransportMock = { sendMail: jest.fn() };
jest.mock('aws-sdk', () => ({
  SNS: jest.fn().mockImplementation(() => awsMock.sns),
  SES: jest.fn().mockImplementation(() => awsMock.ses),
  S3: jest.fn().mockImplementation(() => awsMock.s3),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => createTransportMock),
}));

describe('AwsService', () => {
  let awsService: AwsService;
  const awsConfigValue = {
    AWS_SMS_REGION: process.env.AWS_SMS_REGION,
    AWS_SNS_REGION: process.env.AWS_SNS_REGION,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_SNS_FROM: process.env.AWS_SNS_FROM,
    AWS_BUCKET: process.env.AWS_BUCKET,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        { provide: awsConfig.KEY, useValue: awsConfigValue },
      ],
    }).compile();

    awsService = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(awsService).toBeDefined();
    expect(aws.SNS).toHaveBeenNthCalledWith(1, {
      apiVersion: '2010-03-31',
      region: awsConfigValue.AWS_SMS_REGION,
    });
    expect(aws.SES).toHaveBeenNthCalledWith(1, {
      apiVersion: '2010-12-01',
      region: awsConfigValue.AWS_SNS_REGION,
    });
    expect(nodemailer.createTransport).toHaveBeenNthCalledWith(1, {
      SES: { ses: awsMock.ses, aws },
    });
  });

  it('sendSMS', async () => {
    // ? init variables
    const args = {
      Message: 'Message',
      PhoneNumber: 'PhoneNumber',
    };
    const returnData = {
      result: 'success',
    };
    // ? init mock
    awsMock.sns.promise.mockResolvedValue(returnData.result);
    // ? run
    const result = await awsService.sendSMS(args);
    // ? test
    expect(awsMock.sns.publish).toHaveBeenNthCalledWith(1, args);
    expect(awsMock.sns.promise).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData.result);
  });

  it('sendEmail', async () => {
    // ? init variables
    const args = {
      to: 'to',
      subject: 'subject',
      text: 'text',
    };
    const returnData = { result: 'success' };
    // ? init mock
    createTransportMock.sendMail.mockResolvedValue(returnData.result);
    // ? run
    const result = await awsService.sendEmail(args);
    // ? test
    expect(createTransportMock.sendMail).toHaveBeenNthCalledWith(1, {
      from: awsConfigValue.AWS_SNS_FROM,
      ...args,
    });
    expect(result).toEqual(returnData.result);
  });

  it('uploadToS3', async () => {
    // ? init variables
    const args: Omit<aws.S3.PutObjectRequest, 'Bucket'> = {
      Key: 'key',
    };
    const returnData = {
      s3: {
        promise: '',
      },
    };
    // ? init mock
    awsMock.s3.promise.mockResolvedValue(returnData.s3.promise);
    // ? run
    const result = await awsService.uploadToS3(args);
    // ? test
    expect(awsMock.s3.upload).toHaveBeenNthCalledWith(1, {
      Bucket: awsConfigValue.AWS_BUCKET,
      ...args,
    });
    expect(awsMock.s3.promise).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData.s3.promise);
  });

  it('deleteFromS3', async () => {
    // ? init variables
    const args: Omit<aws.S3.Types.DeleteObjectRequest, 'Bucket'> = {
      Key: 'key',
    };
    const returnData = {
      s3: {
        promise: '',
      },
    };
    // ? init mock
    awsMock.s3.promise.mockResolvedValue(returnData.s3.promise);
    // ? run
    const result = await awsService.deleteFromS3(args);
    // ? test
    expect(awsMock.s3.deleteObject).toHaveBeenNthCalledWith(1, {
      Bucket: awsConfigValue.AWS_BUCKET,
      ...args,
    });
    expect(awsMock.s3.promise).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData.s3.promise);
  });
});
