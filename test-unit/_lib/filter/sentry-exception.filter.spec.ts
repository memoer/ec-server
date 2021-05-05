import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from '~/_lib/filter/sentry-exception.filter';
import { getCallback } from '../../_';
jest.mock('@sentry/node');
// withScope testing 하는 방법
// https://stackoverflow.com/questions/56298972/testing-sentry-with-jest

describe('lib/filter/sentry-exception', () => {
  let sentryExceptionFilter: SentryExceptionFilter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentryExceptionFilter],
    }).compile();
    sentryExceptionFilter = module.get<SentryExceptionFilter>(
      SentryExceptionFilter,
    );
  });

  it('should be defined', () => {
    expect(sentryExceptionFilter).toBeDefined();
  });

  it('if below 500 error, no exceution sentry function', () => {
    // ? init variables
    const exception = new HttpException(
      'status code 400',
      HttpStatus.BAD_REQUEST,
    );
    // ? init mock
    // ? run
    const result = sentryExceptionFilter.catch(exception);
    // ? test
    expect(result).toBe(exception);
    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('if above 500 error, exceution once sentry function', () => {
    // ? init variables
    const exception = new HttpException(
      'status code 500',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    // ? init mock
    const scope = { setTag: jest.fn() };
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
});
