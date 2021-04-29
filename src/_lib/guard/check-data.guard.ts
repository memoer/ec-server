import {
  applyDecorators,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  SetMetadata,
  Type,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRepository } from 'typeorm';
import { META_DATA } from '../constants';
import exceptionTemplate from '../exceptionTemplate';
export enum CheckDataGuardType {
  shouldExist,
  shouldNotExist,
}
@Injectable()
export class CheckDataGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { ENTITY, KEY, TYPE } = META_DATA.CHECK_DATA_GUARD;
    const gqlContext = GqlExecutionContext.create(context);
    const { id } = gqlContext.getArgs();
    const entity = this._reflector.get(ENTITY, context.getHandler());
    const key = this._reflector.get<string>(KEY, context.getHandler());
    const type = this._reflector.get<CheckDataGuardType>(
      TYPE,
      context.getHandler(),
    );
    //
    const data = await getRepository(entity)
      .createQueryBuilder(entity.name)
      .where(`${entity.name}.${key} = :${key}`, { id })
      .getOne();
    switch (type) {
      case CheckDataGuardType.shouldExist:
        if (!data) {
          throw new NotFoundException(
            exceptionTemplate({
              area: 'Guard',
              name: 'checkData',
              msg: `${entity.name}_${id} not found`,
            }),
          );
        }
        break;
      case CheckDataGuardType.shouldNotExist:
        if (data) {
          throw new ConflictException(
            exceptionTemplate({
              area: 'Guard',
              name: 'checkData',
              msg: `${entity.name}_${id} is already existed`,
            }),
          );
        }
        break;
    }
    return true;
  }
}

export function CheckData<T, K extends keyof T>(
  entity: Type<T>,
  type: CheckDataGuardType,
  key?: K,
) {
  const {
    CHECK_DATA_GUARD: { ENTITY, TYPE, KEY },
  } = META_DATA;
  return applyDecorators(
    SetMetadata(ENTITY, entity),
    SetMetadata(TYPE, type),
    SetMetadata(KEY, key || 'id'),
    UseGuards(CheckDataGuard),
  );
}
