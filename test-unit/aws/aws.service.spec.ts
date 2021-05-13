import { Test, TestingModule } from '@nestjs/testing';
import { awsConfig } from '~/@config/register';
import { AwsService } from '~/aws/aws.service';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';

const snsMock = { publish: jest.fn().mockReturnThis(), promise: jest.fn() };
const sesMock = {};
const createTransportMock = { sendMail: jest.fn() };
jest.mock('aws-sdk', () => ({
  SNS: jest.fn().mockImplementation(() => snsMock),
  SES: jest.fn().mockImplementation(() => sesMock),
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => createTransportMock),
}));

describe('AwsService', () => {
  let awsService: AwsService;
  const awsConfigMock = {
    AWS_SMS_REGION: process.env.AWS_SMS_REGION,
    AWS_SNS_REGION: process.env.AWS_SNS_REGION,
    AWS_SNS_FROM: process.env.AWS_SNS_FROM,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsService,
        { provide: awsConfig.KEY, useValue: awsConfigMock },
      ],
    }).compile();

    awsService = module.get<AwsService>(AwsService);
  });

  it('should be defined', () => {
    expect(awsService).toBeDefined();
    expect(aws.SNS).toHaveBeenNthCalledWith(1, {
      apiVersion: '2010-03-31',
      region: awsConfigMock.AWS_SMS_REGION,
    });
    expect(aws.SES).toHaveBeenNthCalledWith(1, {
      apiVersion: '2010-12-01',
      region: awsConfigMock.AWS_SNS_REGION,
    });
    expect(nodemailer.createTransport).toHaveBeenNthCalledWith(1, {
      SES: { ses: sesMock, aws },
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
    snsMock.promise.mockResolvedValue(returnData.result);
    // ? run
    const result = await awsService.sendSMS(args);
    // ? test
    expect(snsMock.publish).toHaveBeenNthCalledWith(1, args);
    expect(snsMock.promise).toHaveBeenCalledTimes(1);
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
      from: awsConfigMock.AWS_SNS_FROM,
      ...args,
    });
    expect(result).toEqual(returnData.result);
  });
});
