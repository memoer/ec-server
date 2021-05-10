import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

const gqlPrototypeCtxMock = {
  getArgs: (GqlExecutionContext.prototype.getArgs = jest.fn()),
  getContext: (GqlExecutionContext.prototype.getContext = jest.fn()),
};

export const gqlExecCtxMock = {
  create: (GqlExecutionContext.create = jest
    .fn()
    .mockReturnValue(gqlPrototypeCtxMock)),
  ...gqlPrototypeCtxMock,
};
export const contextMock = {
  context: new ExecutionContextHost(['test']),
  getHandler: (ExecutionContextHost.prototype.getHandler = jest.fn()),
  getClass: (ExecutionContextHost.prototype.getClass = jest.fn()),
};
export const reflectorMock = {
  reflector: new Reflector(),
  get: (Reflector.prototype.get = jest.fn()),
  getAllAndOverride: (Reflector.prototype.getAllAndOverride = jest.fn()),
};

export const callHandlerMock = {
  handle: jest.fn().mockReturnThis(),
  pipe: jest.fn(),
};

export const getCallback = (fn: any, number = 0) => fn.mock.calls[0][number];

// 변경이 별로 없고 모든 서비스에서 자주 사용하는 Common Service 들은 여기서 선언
export const cacheManagerMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};
export const dbConnMock = {
  transaction: jest.fn(),
};
export const utilServiceMock = {
  removeUndefinedOf: jest.fn(),
  getMs: jest.fn(),
  getRandNum: jest.fn(),
  getSkip: jest.fn(),
};
export const awsServiceMock = {
  sendEmail: jest.fn(),
  sendSMS: jest.fn(),
};
export const jwtServiceMock = { sign: jest.fn() };
export const repositoryMock = () => ({
  findOneOrFail: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  findAndCount: jest.fn(),
});
