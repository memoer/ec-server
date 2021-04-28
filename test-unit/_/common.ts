import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

const gqlPrototypeCtxMock = {
  getArgs: (GqlExecutionContext.prototype.getArgs = jest.fn()),
  getContext: (GqlExecutionContext.prototype.getContext = jest.fn()),
};

export const gqlCtxMock = {
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
