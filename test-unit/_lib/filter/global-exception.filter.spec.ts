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
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [GlobalExceptionFilter],
    // }).compile();
    // globalExceptionFilter = module.get<GlobalExceptionFilter>(
    //   GlobalExceptionFilter,
    // );
  });

  it('should be defined', () => {
    expect(globalExceptionFilter).toBeDefined();
  });

  it('HttpException, 400 error', () => {
    // ? init variables
    const arg = new BadRequestException();
    // ? run
    const result = globalExceptionFilter.catch(arg);
    // ? test
    expect(result).toBe(arg);
    expect(Sentry.withScope).not.toHaveBeenCalled();
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it('HttpException, 500 error', () => {
    // ? init variables
    const arg = new InternalServerErrorException();
    // ? run
    const result = globalExceptionFilter.catch(arg);
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
    const result = globalExceptionFilter.catch(arg);
    getCallback(Sentry.withScope)(scope);
    // ? test
    expect(result).toMatchObject(returnException);
    expect(scope.setTag).toHaveBeenNthCalledWith(1, 'status', '500');
    expect(Sentry.captureException).toHaveBeenNthCalledWith(1, returnException);
  });
});
