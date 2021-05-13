import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { map } from 'rxjs/operators';
import { PaginationOutputInterceptor, exception } from '~/_lib';
import { getCallback, gqlExecCtxMock, callHandlerMock } from '@/common';

jest.mock('rxjs/operators', () => ({
  map: jest.fn(),
}));

describe('lib/interceptor/pagination-output', () => {
  const pageNumber = 1;
  const take = 10;
  const interceptor = new PaginationOutputInterceptor();
  const context = new ExecutionContextHost(['test']);
  //
  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('data type must be [object, number]', () => {
    // ? init variables
    const returnData = {
      gqlExecCtxMock: {
        getArgs: { input: { pageNumber, take } },
      },
    };
    const args = {
      mapCallback: [{}],
    };
    // ? init mock
    gqlExecCtxMock.getArgs.mockReturnValue(returnData.gqlExecCtxMock.getArgs);
    // ? run
    try {
      interceptor.intercept(context, callHandlerMock);
      getCallback(map)(args.mapCallback);
    } catch (error) {
      // ? test
      expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(1, context);
      expect(gqlExecCtxMock.getArgs).toHaveBeenCalledTimes(1);
      expect(error).toMatchObject(
        exception({
          type: 'InternalServerErrorException',
          loc: 'PaginationOutputInterceptor.map',
          msg: 'data type must be [object, number]',
        }),
      );
    }
  });

  it('data[0] type must be object', () => {
    // ? init variables
    const args = {
      mapCallback: [10, 20],
    };
    // ? init mock
    gqlExecCtxMock.getArgs.mockReturnValue({ input: { pageNumber, take } });
    // ? run
    try {
      interceptor.intercept(context, callHandlerMock);
      getCallback(map)(args.mapCallback);
    } catch (error) {
      // ? test
      expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(1, context);
      expect(gqlExecCtxMock.getArgs).toHaveBeenCalledTimes(1);
      expect(error).toMatchObject(
        exception({
          type: 'InternalServerErrorException',
          loc: 'PaginationOutputInterceptor.map',
          msg: 'data[0] type must be object',
        }),
      );
    }
  });

  it('data[1] type must be number', () => {
    // ? init variables
    const returnData = {
      gqlExecCtxMock: {
        getArgs: { input: { pageNumber, take } },
      },
    };
    const args = {
      mapCallback: [{}, '1'],
    };
    // ? init mock
    gqlExecCtxMock.getArgs.mockReturnValue(returnData.gqlExecCtxMock.getArgs);
    // ? run
    try {
      interceptor.intercept(context, callHandlerMock);
      getCallback(map)(args.mapCallback);
    } catch (error) {
      // ? test
      expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(1, context);
      expect(gqlExecCtxMock.getArgs).toHaveBeenCalledTimes(1);
      expect(error).toMatchObject(
        exception({
          type: 'InternalServerErrorException',
          loc: 'PaginationOutputInterceptor.map',
          msg: 'data[1] type must be number',
        }),
      );
    }
  });

  it('should be successfully called', () => {
    // ? init variables
    const data: [Record<string, any>, number] = [{}, 20];
    const totalPage = Math.ceil(data[1] / take);
    // ? init mock
    gqlExecCtxMock.getArgs.mockReturnValue({ input: { pageNumber, take } });
    // ? run
    interceptor.intercept(context, callHandlerMock);
    const cbResult = getCallback(map)(data);
    // ? test
    expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(1, context);
    expect(gqlExecCtxMock.getArgs).toHaveBeenCalledTimes(1);
    expect(callHandlerMock.handle).toHaveBeenCalledTimes(1);
    expect(callHandlerMock.pipe).toHaveBeenCalledTimes(1);
    expect(map).toHaveBeenCalledTimes(1);
    expect(cbResult).toEqual({
      data: data[0],
      totalPage,
      curPage: pageNumber,
      hasNextPage: totalPage !== pageNumber,
    });
  });
});
