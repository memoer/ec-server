import * as nestCommon from '@nestjs/common';
import { UserRole } from '~/user/entity/user.info.entity';
import { META_DATA } from '~/_lib/constants';
import { AuthGuard, authGuardFn } from '~/_lib/guard/auth.guard';
import { reflectorMock } from '@/_/common';
import { TMock } from '@/_/type';

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
    const expectData = {
      setMetaData: 'setMetaData',
      UseGuards: 'UseGuards',
    };
    // ? init mock
    SetMetadata.mockReturnValueOnce(expectData.setMetaData);
    UseGuards.mockReturnValueOnce(expectData.UseGuards);
    // ? run
    authGuardFn(...roles);
    // ? test
    expect(applyDecorators).toHaveBeenNthCalledWith(
      1,
      expectData.setMetaData,
      expectData.UseGuards,
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
