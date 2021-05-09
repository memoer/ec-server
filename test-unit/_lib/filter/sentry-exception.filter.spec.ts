import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from '~/_lib/filter/sentry-exception.filter';
import { getCallback } from '@/common';

jest.mock('@sentry/node');
// withScope testing 하는 방법
// https://stackoverflow.com/questions/56298972/testing-sentry-with-jest

describe('lib/filter/sentry-exception', () => {
  // ? init variables
  let sentryExceptionFilter: SentryExceptionFilter;
  // ? init mocks
  const scope = { setTag: jest.fn() };

  beforeEach(async () => {
    sentryExceptionFilter = new SentryExceptionFilter();
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [SentryExceptionFilter],
    // }).compile();
    // sentryExceptionFilter = module.get<SentryExceptionFilter>(
    //   SentryExceptionFilter,
    // );
  });

  it('should be defined', () => {
    expect(sentryExceptionFilter).toBeDefined();
  });

  it('HttpException, 400 error', () => {
    // ? init variables
    const arg = new BadRequestException();
    // ? run
    const result = sentryExceptionFilter.catch(arg);
    // ? test
    expect(result).toBe(arg);
    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('HttpException, 500 error', () => {
    // ? init variables
    const arg = new InternalServerErrorException();
    // ? run
    const result = sentryExceptionFilter.catch(arg);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(result).toBe(arg);
    expect(Sentry.withScope).toHaveBeenCalledTimes(1);
    expect(scope.setTag).toHaveBeenNthCalledWith(
      1,
      'status',
      arg.getStatus().toString(),
    );
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, arg);
  });

  it('if no HttpException, 500 error', () => {
    // ? init variables
    const arg = new Error('test');
    const returnException = new InternalServerErrorException(arg);
    // ? run
    const result = sentryExceptionFilter.catch(arg);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(result).toMatchObject(returnException);
    expect(scope.setTag).toHaveBeenNthCalledWith(1, 'status', '500');
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, returnException);
  });
});
