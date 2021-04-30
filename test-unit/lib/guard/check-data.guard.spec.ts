import * as nestCommon from '@nestjs/common';
import { getRepository } from 'typeorm';
import { META_DATA } from '~/_lib/constants';
import {
  CheckData,
  CheckDataGuard,
  CheckDataGuardType,
} from '~/_lib/guard/check-data.guard';
import { TMock } from '../../_/util';
import { reflectorMock, gqlCtxMock, contextMock } from '../../_';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
  class MockEntity {
    id!: number;
    name!: string;
  }
  const checkDataGuard = new CheckDataGuard(reflectorMock.reflector);
  const { ENTITY, TYPE, KEY } = META_DATA.CHECK_DATA_GUARD;

  it('should be defined', () => {
    expect(checkDataGuard).toBeDefined();
  });

  describe('function CheckData', () => {
    const {
      applyDecorators,
      SetMetadata,
      UseGuards,
    } = (nestCommon as unknown) as TMock<typeof nestCommon>;
    it('applyDecorators with 1, SetMetaData with 3, UseGuards with 1 should called', () => {
      // ? variables to use & init mock
      const returnData = {
        SetMetadata: {
          ENTITY: 'entity',
          TYPE: 'type',
          KEY: 'id',
        },
        UserGuard: 'UseGuards',
      } as const;
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.ENTITY);
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.TYPE);
      SetMetadata.mockReturnValueOnce(returnData.SetMetadata.KEY);
      UseGuards.mockReturnValue(returnData.UserGuard);
      // ? run
      CheckData(MockEntity, CheckDataGuardType.shouldExist);
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
    contextMock.getHandler.mockReturnValue('contextMock');
    const typeormMock = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };
    (getRepository as jest.Mock<any, any>).mockReturnValue(typeormMock);
    const testCaseList = [
      { getOneData: true, type: CheckDataGuardType.shouldExist },
      { getOneData: true, type: CheckDataGuardType.shouldNotExist },
      { getOneData: false, type: CheckDataGuardType.shouldExist },
      { getOneData: false, type: CheckDataGuardType.shouldNotExist },
    ];
    const testFn = ({
      getOneData,
      type,
    }: {
      getOneData: boolean;
      type: CheckDataGuardType;
    }) => async () => {
      // ? variables to use & init mock
      const id = '1';
      const entity = { name: 'entity' };
      const key = 'key';
      gqlCtxMock.getArgs.mockReturnValue({ id });
      reflectorMock.get.mockReturnValueOnce(entity);
      reflectorMock.get.mockReturnValueOnce(key);
      reflectorMock.get.mockReturnValueOnce(type);
      typeormMock.getOne.mockResolvedValue(getOneData);
      try {
        // ? run
        const result = await checkDataGuard.canActivate(contextMock.context);
        // ? test
        expect(result).toEqual(true);
      } catch (error) {
        switch (type) {
          case CheckDataGuardType.shouldExist:
            expect(error).toMatchObject(
              new NotFoundException(`${entity.name}_${id} not found`),
            );
            break;
          case CheckDataGuardType.shouldNotExist:
            expect(error).toMatchObject(
              new ConflictException(`${entity.name}_${id} is already existed`),
            );
            break;
        }
      } finally {
        expect(gqlCtxMock.create).toHaveBeenNthCalledWith(
          1,
          contextMock.context,
        );
        expect(gqlCtxMock.getArgs).toHaveBeenCalledTimes(1);
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
        expect(getRepository).toHaveBeenNthCalledWith(1, entity);
        expect(typeormMock.createQueryBuilder).toHaveBeenNthCalledWith(
          1,
          entity.name,
        );
        expect(typeormMock.where).toHaveBeenNthCalledWith(
          1,
          `${entity.name}.${key} = :${key}`,
          { id },
        );
      }
    };
    testCaseList.forEach(({ getOneData, type }) =>
      it(
        `getOneData, type is ${getOneData}, ${type}`,
        testFn({ getOneData, type }),
      ),
    );
  });
});