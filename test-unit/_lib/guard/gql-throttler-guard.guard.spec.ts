import { GqlThrottlerGuard } from '~/_lib/guard/gql-throttler-guard.guard';
import { contextMock, gqlCtxMock, reflectorMock } from '../../_/common';
import { ThrottlerStorage } from '@nestjs/throttler';

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
    const expectResult = { req: 'req', res: 'res' };
    // ? init mock
    gqlCtxMock.getContext.mockReturnValue(expectResult);
    // ? run
    const result = gqlThrottlerGuard.getRequestResponse(contextMock.context);
    // ? test
    expect(gqlCtxMock.create).toHaveBeenNthCalledWith(1, contextMock.context);
    expect(gqlCtxMock.getContext).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectResult);
  });
});
