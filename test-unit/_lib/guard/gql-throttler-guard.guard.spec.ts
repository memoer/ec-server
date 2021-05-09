import { ThrottlerStorage } from '@nestjs/throttler';
import { GqlThrottlerGuard } from '~/_lib/guard/gql-throttler-guard.guard';
import { contextMock, gqlExecCtxMock, reflectorMock } from '@/common';

describe('GqlThrottlerGuardGuard', () => {
  const throttlerStorageMock: ThrottlerStorage = {
    storage: { test: [1] },
    getRecord: async () => [1],
    addRecord: async () => {},
  };
  const gqlThrottlerGuard = new GqlThrottlerGuard(
    {},
    throttlerStorageMock,
    reflectorMock.reflector,
  );
  it('should be defined', () => {
    expect(gqlThrottlerGuard).toBeDefined();
  });

  it('', () => {
    // ? init variables
    const returnData = { req: 'req', res: 'res' };
    // ? init mock
    gqlExecCtxMock.getContext.mockReturnValue(returnData);
    // ? run
    const result = gqlThrottlerGuard.getRequestResponse(contextMock.context);
    // ? test
    expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(
      1,
      contextMock.context,
    );
    expect(gqlExecCtxMock.getContext).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData);
  });
});
