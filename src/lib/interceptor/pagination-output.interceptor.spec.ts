import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map } from 'rxjs/operators';
import { PaginationOutputInterceptor } from './pagination-output.interceptor';
jest.mock('rxjs/operators', () => ({
  map: jest.fn(),
}));

describe('paginationOutputInterceptor', () => {
  // * mock
  const callHandlerMock = {
    handle: jest.fn().mockReturnThis(),
    pipe: jest.fn(),
  };
  const gqlCtxMock = {
    getArgs: (GqlExecutionContext.prototype.getArgs = jest.fn()),
  };
  const createGqlCtx: jest.Mock<
    Record<'getArgs', jest.Mock>
  > = (GqlExecutionContext.create = jest.fn().mockReturnValue(gqlCtxMock));
  // * variables
  const pageNumber = 1;
  const take = 10;
  const interceptor = new PaginationOutputInterceptor();
  const context = new ExecutionContextHost(['test']);
  //
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });
  it('', () => {
    // * variables to use & init mock
    const data = [10, 20];
    gqlCtxMock.getArgs.mockReturnValue({ pageNumber, take });
    // * run
    interceptor.intercept(context, callHandlerMock);
    const callback = (map as jest.Mock<any, any>).mock.calls[0][0]; // ! 무조건 `interceptor.intercept()` 호출 이후에 가져와야 한다.
    const cbResult = callback(data);
    // * test
    expect(createGqlCtx).toHaveBeenNthCalledWith(1, context);
    expect(gqlCtxMock.getArgs).toHaveBeenCalledTimes(1);
    expect(callHandlerMock.handle).toHaveBeenCalledTimes(1);
    expect(callHandlerMock.pipe).toHaveBeenCalledTimes(1);
    expect(map).toHaveBeenCalledTimes(1);
    expect(cbResult).toEqual({
      data: data[0],
      totalCount: data[1],
      curPage: pageNumber,
      hasNextPage: Math.ceil(data[1] / take) === pageNumber,
    });
  });
});
