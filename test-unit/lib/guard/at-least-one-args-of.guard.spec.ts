import * as nestCommon from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { META_DATA } from '~/_lib/constants';
import {
  atLeastOneArgsOfGuardFn,
  AtLeastOneArgsOfGuard,
} from '~/_lib/guard/at-least-one-args-of.guard';
import { TMock } from '../../_/util';
import { gqlCtxMock, reflectorMock, contextMock } from '../../_';
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: jest.fn(),
  SetMetadata: jest.fn(),
  UseGuards: jest.fn(),
}));

describe('lib/guard/at-least-one-args-of', () => {
  const { KEY_LIST } = META_DATA.AT_LEAST_ONE_OF_GUARD;

  describe('function atLeastOneArgsOfGuardFn', () => {
    const {
      applyDecorators,
      SetMetadata,
      UseGuards,
    } = (nestCommon as unknown) as TMock<typeof nestCommon>;

    it('applyDecorators, SetMetaData, UseGuards should called with 1', () => {
      // ? variables to use & init mock
      const returnData = {
        SetMetadata: 'SetMetadata',
        UserGuard: 'UseGuards',
      };
      SetMetadata.mockReturnValue(returnData.SetMetadata);
      UseGuards.mockReturnValue(returnData.UserGuard);
      const keyList = ['hello', 'good'];
      // ? run
      atLeastOneArgsOfGuardFn(keyList);
      // ? test
      expect(applyDecorators).toHaveBeenNthCalledWith(
        1,
        returnData.SetMetadata,
        returnData.UserGuard,
      );
      expect(SetMetadata).toHaveBeenNthCalledWith(1, KEY_LIST, keyList);
      expect(UseGuards).toHaveBeenNthCalledWith(1, AtLeastOneArgsOfGuard);
    });
  });

  describe('class AtLeastOneArgsOfGuard', () => {
    contextMock.getHandler.mockReturnValue('contextMock');
    const atLeastOneArgsOfGuardFn = new AtLeastOneArgsOfGuard(
      reflectorMock.reflector,
    );
    const args = {
      name: 'jaename',
      password: 'q1w2e3',
    };
    it('should be defined', () => {
      expect(atLeastOneArgsOfGuardFn).toBeDefined();
    });

    it('if value returned by reflector get method in gqlContext.getArgs() keys, true', () => {
      // ? variables to use & init mock
      const value = ['name'];
      reflectorMock.get.mockReturnValue(value);
      gqlCtxMock.getArgs.mockReturnValue(args);
      // ? run
      const result = atLeastOneArgsOfGuardFn.canActivate(contextMock.context);
      // ? test
      expect(gqlCtxMock.create).toHaveBeenNthCalledWith(1, contextMock.context);
      expect(reflectorMock.get).toHaveBeenNthCalledWith(
        1,
        KEY_LIST,
        'contextMock',
      );
      expect(contextMock.getHandler).toHaveBeenCalledTimes(1);
      expect(gqlCtxMock.getArgs).toHaveBeenCalledTimes(1);
      expect(result).toEqual(true);
    });

    it('if not value returned by reflector get method in gqlContext.getArgs() keys, throw BadRequestException', () => {
      // ? variables to use & init mock
      const value = ['email'];
      reflectorMock.get.mockReturnValue(value);
      contextMock.getHandler.mockReturnValue('contextMock');
      gqlCtxMock.getArgs.mockReturnValue({
        name: 'jaename',
        password: 'q1w2e3',
      });
      try {
        // ? run
        atLeastOneArgsOfGuardFn.canActivate(contextMock.context);
      } catch (error) {
        // ? test
        expect(gqlCtxMock.create).toHaveBeenNthCalledWith(
          1,
          contextMock.context,
        );
        expect(reflectorMock.get).toHaveBeenNthCalledWith(
          1,
          KEY_LIST,
          'contextMock',
        );
        expect(contextMock.getHandler).toHaveBeenCalledTimes(1);
        expect(gqlCtxMock.getArgs).toHaveBeenCalledTimes(1);
        expect(error).toMatchObject(
          new BadRequestException(
            `should exist at least one of ${value.join(', ')}`,
          ),
        );
      }
    });
  });
});
