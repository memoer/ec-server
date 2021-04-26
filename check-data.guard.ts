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
import { SharedService } from '~/shared/shared.service';
import { META_DATA } from '../constants';
export enum CheckDataGuardType {
  shouldExist,
  shouldNotExist,
}
@Injectable()
export class CheckDataGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _sharedService: SharedService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { id } = gqlContext.getArgs();
    const { ENTITY, KEY, TYPE } = this._sharedService.getValueFromMetaData<
      typeof META_DATA['CHECK_DATA_GUARD']
    >({
      reflector: this._reflector,
      context,
      metaDataObj: META_DATA.CHECK_DATA_GUARD,
    });
    //
    const data = await getRepository(ENTITY)
      .createQueryBuilder(ENTITY.name)
      .where(`${name}.${KEY} = :${KEY}`, { id })
      .getOne();
    switch (TYPE) {
      case CheckDataGuardType.shouldExist:
        if (!data) {
          throw new NotFoundException(`${name}_${id} not found`);
        }
      case CheckDataGuardType.shouldNotExist:
        if (data) {
          throw new ConflictException(`${name}_${id} is already existed`);
        }
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
