import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { map } from 'rxjs/operators';
import { PaginationOutputInterceptor } from '~/_lib/interceptor/pagination-output.interceptor';
import { getCallback, gqlCtxMock, nextCallHandler } from '../../_';
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

  it('should be successfully called', () => {
    // ? init variables
    const data = [10, 20];
    const totalPage = Math.ceil(data[1] / take);
    // ? init mock
    gqlCtxMock.getArgs.mockReturnValue({ input: { pageNumber, take } });
    // ? run
    interceptor.intercept(context, nextCallHandler);
    const cbResult = getCallback(map)(data);
    // ? test
    expect(gqlCtxMock.create).toHaveBeenNthCalledWith(1, context);
    expect(gqlCtxMock.getArgs).toHaveBeenCalledTimes(1);
    expect(nextCallHandler.handle).toHaveBeenCalledTimes(1);
    expect(nextCallHandler.pipe).toHaveBeenCalledTimes(1);
    expect(map).toHaveBeenCalledTimes(1);
    expect(cbResult).toEqual({
      data: data[0],
      totalPage,
      curPage: pageNumber,
      hasNextPage: totalPage !== pageNumber,
    });
  });
});
