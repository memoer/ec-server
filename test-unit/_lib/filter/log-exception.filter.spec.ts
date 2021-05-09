import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LogExceptionFilter } from '~/_lib/filter/log-exception.filter';

describe('LogExceptionFilter', () => {
  // ? init variables
  const logExceptionFilter = new LogExceptionFilter();
  // ? init mocks
  it('should be defined', () => {
    expect(logExceptionFilter).toBeDefined();
  });

  it('HttpException', () => {
    // ? init variables
    const returnException = new BadRequestException('test');
    // ? run
    try {
      logExceptionFilter.catch(returnException);
    } catch (error) {
      // ? test
      expect(error).toMatchObject(returnException);
    }
  });

  it('no HttpException', () => {
    // ? init variables
    const returnException = new Error('test');
    // ? run
    try {
      logExceptionFilter.catch(returnException);
    } catch (error) {
      // ? test
      expect(error).toMatchObject(
        new InternalServerErrorException(returnException),
      );
    }
  });
});
