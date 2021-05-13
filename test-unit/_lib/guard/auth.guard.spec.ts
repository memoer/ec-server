import * as nestCommon from '@nestjs/common';
import { UserRole } from '~/user/entity/user.info.entity';
import { META_DATA } from '~/_lib/constant';
import { AuthGuard, authGuardFn } from '~/_lib/guard/auth.guard';
import { contextMock, gqlExecCtxMock, reflectorMock } from '@/common';
import { TMock } from '@/type';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: jest.fn(),
  SetMetadata: jest.fn(),
  UseGuards: jest.fn(),
}));

describe('AuthGuard', () => {
  // ? init variables
  let authGuard: AuthGuard;

  beforeEach(async () => {
    authGuard = new AuthGuard(reflectorMock.reflector);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('function authGuardFn', () => {
    // ? init variables
    const {
      applyDecorators,
      SetMetadata,
      UseGuards,
    } = (nestCommon as unknown) as TMock<typeof nestCommon>;
    const args: (keyof typeof UserRole)[] = ['CLIENT', 'CLIENT_ADMIN'];
    const returnData = {
      setMetaData: 'setMetaData',
      UseGuards: 'UseGuards',
    };
    // ? init mock
    SetMetadata.mockReturnValueOnce(returnData.setMetaData);
    UseGuards.mockReturnValueOnce(returnData.UseGuards);
    // ? run
    authGuardFn(...args);
    // ? test
    expect(applyDecorators).toHaveBeenNthCalledWith(
      1,
      returnData.setMetaData,
      returnData.UseGuards,
    );
    expect(SetMetadata).toHaveBeenNthCalledWith(1, META_DATA.ROLES, args);
    expect(UseGuards).toHaveBeenNthCalledWith(1, AuthGuard);
  });

  it('class AuthGuard, if roles length 0, return true when user data exist else false', () => {
    // ? init variables
    const returnData = {
      getContext: { req: { user: 'user' } },
      getAllAndOverride: [],
      ctx: { getHandler: 'h', getClass: 'c' },
      result_1: true,
      result_2: false,
    };
    // ? init mock
    gqlExecCtxMock.getContext.mockReturnValue(returnData.getContext);
    reflectorMock.getAllAndOverride.mockReturnValue(
      returnData.getAllAndOverride,
    );
    contextMock.getHandler.mockReturnValue(returnData.ctx.getHandler);
    contextMock.getClass.mockReturnValue(returnData.ctx.getClass);
    // ? run
    const result_1 = authGuard.canActivate(contextMock.context);
    // ? test
    expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(
      1,
      contextMock.context,
    );
    expect(gqlExecCtxMock.getContext).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenNthCalledWith(
      1,
      META_DATA.ROLES,
      [returnData.ctx.getHandler, returnData.ctx.getClass],
    );
    expect(result_1).toEqual(returnData.result_1);
    // ? re-run
    (returnData.getContext.req.user as any) = null;
    const result_2 = authGuard.canActivate(contextMock.context);
    expect(result_2).toEqual(returnData.result_2);
  });

  it('class AuthGuard, if roles length is not 0, return true when user info same role else false', () => {
    // ? init variables
    const returnData = {
      getContext: { req: { user: { info: { role: 'CLIENT' } } } },
      getAllAndOverride: ['CLIENT'],
      ctx: { getHandler: 'h', getClass: 'c' },
      result_1: true,
      result_2: false,
    };
    // ? init mock
    gqlExecCtxMock.getContext.mockReturnValue(returnData.getContext);
    reflectorMock.getAllAndOverride.mockReturnValue(
      returnData.getAllAndOverride,
    );
    contextMock.getHandler.mockReturnValue(returnData.ctx.getHandler);
    contextMock.getClass.mockReturnValue(returnData.ctx.getClass);
    // ? run
    const result_1 = authGuard.canActivate(contextMock.context);
    // ? test
    expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(
      1,
      contextMock.context,
    );
    expect(gqlExecCtxMock.getContext).toHaveBeenCalledTimes(1);
    expect(reflectorMock.getAllAndOverride).toHaveBeenNthCalledWith(
      1,
      META_DATA.ROLES,
      [returnData.ctx.getHandler, returnData.ctx.getClass],
    );
    expect(result_1).toEqual(returnData.result_1);
    // ? re-run
    (returnData.getContext.req.user.info.role as any) = 'ADMIN';
    const result_2 = authGuard.canActivate(contextMock.context);
    expect(result_2).toEqual(returnData.result_2);
  });
});
