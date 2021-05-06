import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from '~/_lib/filter/sentry-exception.filter';
import { getCallback } from '@/_/common';
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
    const exception = new BadRequestException();
    // ? run
    const result = sentryExceptionFilter.catch(exception);
    // ? test
    expect(result).toBe(exception);
    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('HttpException, 500 error', () => {
    // ? init variables
    const exception = new InternalServerErrorException();
    // ? run
    const result = sentryExceptionFilter.catch(exception);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(result).toBe(exception);
    expect(Sentry.withScope).toHaveBeenCalledTimes(1);
    expect(scope.setTag).toHaveBeenNthCalledWith(
      1,
      'status',
      exception.getStatus().toString(),
    );
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, exception);
  });

  it('if no HttpException, 500 error', () => {
    // ? init variables
    const exception = new Error('test');
    const expectException = new InternalServerErrorException(exception);
    // ? run
    const result = sentryExceptionFilter.catch(exception);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(result).toMatchObject(expectException);
    expect(scope.setTag).toHaveBeenNthCalledWith(1, 'status', '500');
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, expectException);
  });
});
