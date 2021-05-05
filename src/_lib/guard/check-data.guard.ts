import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  Type,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRepository } from 'typeorm';
import { META_DATA } from '../constants';
import exception from '../exception';
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
    const entity = this._reflector.get(ENTITY, context.getHandler());
    const key = this._reflector.get<string>(KEY, context.getHandler());
    const type = this._reflector.get<CheckDataGuardType>(
      TYPE,
      context.getHandler(),
    );
    const value = gqlContext.getArgs().input[key];
    //
    const data = await getRepository(entity)
      .createQueryBuilder(entity.name)
      .where(`${entity.name}.${key} = :${key}`, { [key]: value })
      .getOne();
    switch (type) {
      case CheckDataGuardType.shouldExist:
        if (!data) {
          throw exception({
            type: 'NotFoundException',
            name: 'CheckDataGuard/canActive',
            msg: `${entity.name}_${key}<${value}> is not found`,
          });
        }
        break;
      case CheckDataGuardType.shouldNotExist:
        if (data) {
          throw exception({
            type: 'ConflictException',
            name: 'CheckDataGuard/canActive',
            msg: `${entity.name}_${key}<${value}> is already existed`,
          });
        }
        break;
    }
    return true;
  }
}

export function checkDataGuardFn<T, K extends keyof T>(
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
