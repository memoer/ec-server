import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { GlobalExceptionFilter } from '~/_lib';
import { getCallback } from '@/common';

jest.mock('@sentry/node');
// withScope testing 하는 방법
// https://stackoverflow.com/questions/56298972/testing-sentry-with-jest

describe('lib/filter/sentry-exception', () => {
  // ? init variables
  let globalExceptionFilter: GlobalExceptionFilter;
  // ? init mocks
  const scope = { setTag: jest.fn() };

  beforeEach(async () => {
    globalExceptionFilter = new GlobalExceptionFilter();
  });

  it('should be defined', () => {
    expect(globalExceptionFilter).toBeDefined();
  });

  it('if httpException code below 500 throw, return httpException', () => {
    // ? init variables
    const exception = new BadRequestException();
    // ? run
    const result = globalExceptionFilter.catch(exception);
    // ? test
    expect(result).toEqual(exception);
  });

  it('if not httpException throw, return InternalServerException', () => {
    // ? init variables
    const exception = new Error();
    const returnData = {
      result: new InternalServerErrorException(
        exception.message,
        exception.name,
      ),
    };
    // ? run
    const result = globalExceptionFilter.catch(exception);
    // ? test
    expect(result).toEqual(returnData.result);
  });

  it('if httpException code above 500 In loca&dev, log', () => {
    // ? init variables
    process.env.NODE_ENV = 'local';
    const exception = new InternalServerErrorException();
    // ? init mocks
    const consoleMock = {
      info: jest.spyOn(console, 'info').mockImplementation(() => null),
      error: jest.spyOn(console, 'error').mockImplementation(() => null),
    };
    // ? run
    const result = globalExceptionFilter.catch(exception);
    // ? test
    expect(consoleMock.info).toHaveBeenNthCalledWith(
      1,
      `isHttpException: ${true}`,
    );
    expect(consoleMock.error).toHaveBeenNthCalledWith(1, exception);
    expect(result).toEqual(exception);
  });

  it('if httpException code above 500 In staging&prod, catpure', () => {
    // ? init variables
    process.env.NODE_ENV = 'prod';
    const exception = new InternalServerErrorException();
    // ? run
    const result = globalExceptionFilter.catch(exception);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(Sentry.withScope).toHaveBeenCalledTimes(1);
    expect(scope.setTag).toHaveBeenNthCalledWith(1, 'status', 500);
    expect(scope.setTag).toHaveBeenNthCalledWith(2, 'isHttpException', true);
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, exception);
    expect(result).toEqual(exception);
  });

  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });
});
