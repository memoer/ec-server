import * as nestCommon from '@nestjs/common';
import { UserRole } from '~/@database/entities/user.info.entity';
import { META_DATA } from '~/_lib/constants';
import { AuthGuard, authGuardFn } from '~/_lib/guard/auth.guard';
import { reflectorMock } from '../../_';
import { TMock } from '../../_/util';
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: jest.fn(),
  SetMetadata: jest.fn(),
  UseGuards: jest.fn(),
}));

describe('AuthGuard', () => {
  // ? init variables
  const authGuard = new AuthGuard(reflectorMock.reflector);

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
    const roles: (keyof typeof UserRole)[] = ['CLIENT', 'CLIENT_ADMIN'];
    const returnData = {
      setMetaData: 'setMetaData',
      UseGuards: 'UseGuards',
    };
    // ? init mock
    SetMetadata.mockReturnValueOnce(returnData.setMetaData);
    UseGuards.mockReturnValueOnce(returnData.UseGuards);
    // ? run
    authGuardFn(...roles);
    // ? test
    expect(applyDecorators).toHaveBeenNthCalledWith(
      1,
      returnData.setMetaData,
      returnData.UseGuards,
    );
    expect(SetMetadata).toHaveBeenNthCalledWith(1, META_DATA.ROLES, roles);
    expect(UseGuards).toHaveBeenNthCalledWith(1, AuthGuard);
  });

  it('class AuthGuard', () => {
    // ? init variables
    // ? init mock
    // ? run
    // ? test
  });
});
