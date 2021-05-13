import * as nestCommon from '@nestjs/common';
import { getRepository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import exception from '~/_lib/exception';
import { META_DATA } from '~/_lib/constant';
import {
  CheckDataGuard,
  checkDataGuardFn,
  CheckDataGuardType,
} from '~/_lib/guard/check-data.guard';
import { TMock } from '@/type';
import { reflectorMock, gqlExecCtxMock, contextMock } from '@/common';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: jest.fn(),
  SetMetadata: jest.fn(),
  UseGuards: jest.fn(),
}));
jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

describe('CheckDataGuard', () => {
  const checkDataGuardCls = new CheckDataGuard(reflectorMock.reflector);
  const { ENTITY, TYPE, KEY } = META_DATA.CHECK_DATA_GUARD;

  it('should be defined', () => {
    expect(checkDataGuardCls).toBeDefined();
  });

  describe('function checkDataGuardFn', () => {
    // ? init variables
    const {
      applyDecorators,
      SetMetadata,
      UseGuards,
    } = (nestCommon as unknown) as TMock<typeof nestCommon>;

    it('applyDecorators with 1, SetMetaData with 3, UseGuards with 1 should called', () => {
      // ? init variables
      class MockEntity {
        id!: number;
        name!: string;
      }
      const returnData = {
        SetMetadata: {
          ENTITY: 'entity',
          TYPE: 'type',
          KEY: 'id',
        },
        UserGuard: 'UseGuards',
      } as const;
      // ? init mock
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.ENTITY);
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.TYPE);
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.KEY);
      UseGuards.mockReturnValue(returnData.UserGuard);
      // ? run
      checkDataGuardFn(MockEntity, CheckDataGuardType.shouldExist);
      // ? test
      expect(applyDecorators).toHaveBeenNthCalledWith(
        1,
        returnData.SetMetadata.ENTITY,
        returnData.SetMetadata.TYPE,
        returnData.SetMetadata.KEY,
        returnData.UserGuard,
      );
      expect(SetMetadata).toHaveBeenNthCalledWith(1, ENTITY, MockEntity);
      expect(SetMetadata).toHaveBeenNthCalledWith(
        2,
        TYPE,
        CheckDataGuardType.shouldExist,
      );
      expect(SetMetadata).toHaveBeenNthCalledWith(3, KEY, 'id');
      expect(UseGuards).toHaveBeenNthCalledWith(1, CheckDataGuard);
    });
  });

  describe('class AtLeastOneArgsOfGuard', () => {
    // ? init variables
    const typeormMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    // ? init mock
    contextMock.getHandler.mockReturnValue('contextMock');
    (getRepository as jest.Mock<any, any>).mockReturnValue(typeormMock);

    [
      { getOneData: true, type: CheckDataGuardType.shouldExist },
      { getOneData: true, type: CheckDataGuardType.shouldNotExist },
      { getOneData: false, type: CheckDataGuardType.shouldExist },
      { getOneData: false, type: CheckDataGuardType.shouldNotExist },
    ].forEach(({ getOneData, type }) =>
      it(`getOneData, type is ${getOneData}, ${type}`, async () => {
        // ? variables to use
        const returnData = {
          gqlExecCtxMock: {
            getArgs: { input: { id: '1' } },
          },
          reflectorMock: {
            get: [{ name: 'entity' }, 'id'],
          },
        };
        // ? init mock
        gqlExecCtxMock.getArgs.mockReturnValue(
          returnData.gqlExecCtxMock.getArgs,
        );
        reflectorMock.get.mockReturnValueOnce(returnData.reflectorMock.get[0]);
        reflectorMock.get.mockReturnValueOnce(returnData.reflectorMock.get[1]);
        reflectorMock.get.mockReturnValueOnce(type);
        typeormMock.getOne.mockResolvedValue(getOneData);
        try {
          // ? run
          const result = await checkDataGuardCls.canActivate(
            contextMock.context,
          );
          // ? test
          expect(result).toEqual(true);
        } catch (error) {
          switch (type) {
            case CheckDataGuardType.shouldExist:
              expect(error).toMatchObject(
                exception({
                  type: 'NotFoundException',
                  loc: 'CheckDataGuard.canActive',
                  msg: `${(returnData.reflectorMock.get[0] as any).name}_${
                    returnData.reflectorMock.get[1]
                  }<${
                    returnData.gqlExecCtxMock.getArgs.input.id
                  }> is not found`,
                }),
              );
              break;
            case CheckDataGuardType.shouldNotExist:
              expect(error).toMatchObject(
                new ConflictException(
                  exception({
                    type: 'ConflictException',
                    loc: 'CheckDataGuard.canActive',
                    msg: `${(returnData.reflectorMock.get[0] as any).name}_${
                      returnData.reflectorMock.get[1]
                    }<${
                      returnData.gqlExecCtxMock.getArgs.input.id
                    }> is already existed`,
                  }),
                ),
              );
              break;
          }
        } finally {
          expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(
            1,
            contextMock.context,
          );
          expect(gqlExecCtxMock.getArgs).toHaveBeenCalledTimes(1);
          expect(reflectorMock.get).toHaveBeenNthCalledWith(
            1,
            ENTITY,
            'contextMock',
          );
          expect(reflectorMock.get).toHaveBeenNthCalledWith(
            2,
            KEY,
            'contextMock',
          );
          expect(reflectorMock.get).toHaveBeenNthCalledWith(
            3,
            TYPE,
            'contextMock',
          );
          expect(getRepository).toHaveBeenNthCalledWith(
            1,
            returnData.reflectorMock.get[0],
          );
          expect(typeormMock.createQueryBuilder).toHaveBeenNthCalledWith(
            1,
            (returnData.reflectorMock.get[0] as any).name,
          );
          expect(typeormMock.where).toHaveBeenNthCalledWith(
            1,
            `${(returnData.reflectorMock.get[0] as any).name}.${
              returnData.reflectorMock.get[1]
            } = :${returnData.reflectorMock.get[1]}`,
            { id: returnData.gqlExecCtxMock.getArgs.input.id },
          );
          expect(typeormMock.getOne).toHaveBeenCalledTimes(1);
        }
      }),
    );
  });
});
