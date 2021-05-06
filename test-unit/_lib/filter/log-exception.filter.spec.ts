import {
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { LogExceptionFilter } from '~/_lib/filter/log-exception.filter';

describe('LogExceptionFilter', () => {
  // ? init variables
  const logExceptionFilter = new LogExceptionFilter();
  const request = {
    body: 'body',
  };
  // ? init mocks
  const responseMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const ctxMock: HttpArgumentsHost = {
    getRequest: jest.fn().mockReturnValue(request),
    getResponse: jest.fn().mockReturnValue(responseMock),
    getNext: jest.fn(),
  };
  const argumentsHostMock: ArgumentsHost = {
    switchToHttp: jest.fn().mockReturnValue(ctxMock),
    getArgByIndex: jest.fn(),
    getArgs: jest.fn(),
    getType: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  };
  it('should be defined', () => {
    expect(logExceptionFilter).toBeDefined();
  });

  it('HttpException', () => {
    // ? init variables
    const exception = new BadRequestException('test');
    // ? run
    try {
      logExceptionFilter.catch(exception, argumentsHostMock);
    } catch (error) {
      // ? test
      expect(argumentsHostMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(ctxMock.getResponse).toHaveBeenCalledTimes(1);
      expect(ctxMock.getResponse).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenNthCalledWith(1, 400);
      expect(responseMock.json).toHaveBeenNthCalledWith(1, {
        exception,
        body: request.body,
      });
      expect(error).toMatchObject(exception);
    }
  });

  it('no HttpException', () => {
    // ? init variables
    const exception = new Error('test');
    const expectException = new InternalServerErrorException(exception);
    // ? run
    try {
      logExceptionFilter.catch(exception, argumentsHostMock);
    } catch (error) {
      // ? test
      expect(argumentsHostMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(ctxMock.getResponse).toHaveBeenCalledTimes(1);
      expect(ctxMock.getResponse).toHaveBeenCalledTimes(1);
      expect(responseMock.status).toHaveBeenNthCalledWith(1, 500);
      expect(responseMock.json).toHaveBeenNthCalledWith(1, {
        exception: expectException,
        body: request.body,
      });
      expect(error).toMatchObject(exception);
    }
  });
});
