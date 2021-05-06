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
};
export const reflectorMock = {
  reflector: new Reflector(),
  get: (Reflector.prototype.get = jest.fn()),
};

export const callHandlerMock = {
  handle: jest.fn().mockReturnThis(),
  pipe: jest.fn(),
};

export const getCallback = (fn: any, number = 0) => fn.mock.calls[0][number];

class UserMock {
  email = 'test@test.com';
  nickname = 'testNickname';
  sex = 'MALE';
  birthDate = new Date();
  country = 'kr';
  role = 'CLIENT';
  status = 'ACTIVE';
}

export const userMock = new UserMock();
