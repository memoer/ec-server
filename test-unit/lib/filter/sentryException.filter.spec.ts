import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from '~/lib/filter/sentryException.filter';
// withScope testing 하는 방법
// https://stackoverflow.com/questions/56298972/testing-sentry-with-jest
jest.mock('@sentry/node');
describe('lib/filter/SentryExceptionFilter', () => {
  let sentryExceptionFilter: SentryExceptionFilter;
  beforeEach(async () => {
    jest.clearAllMocks();
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
    const exception = new HttpException(
      'status code 400',
      HttpStatus.BAD_REQUEST,
    );
    const result = sentryExceptionFilter.catch(exception);
    expect(result).toBe(exception);
    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
  it('if above 500 error, exceution once sentry function', () => {
    const exception = new HttpException(
      'status code 500',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    const result = sentryExceptionFilter.catch(exception);
    const callback = (Sentry.withScope as any).mock.calls[0][0];
    const scope = { setTag: jest.fn() };
    callback(scope);
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
