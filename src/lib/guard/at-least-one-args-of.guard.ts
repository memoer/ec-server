import {
  applyDecorators,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { SharedService } from '~/shared/shared.service';
import { META_DATA } from '../constants';

@Injectable()
export class AtLeastOneArgsOfGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    private readonly _sharedService: SharedService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { KEY_LIST } = this._sharedService.getValueFromMetaData<
      typeof META_DATA['AT_LEAST_ONE_OF_GUARD'],
      string[]
    >({
      reflector: this._reflector,
      context,
      metaDataObj: META_DATA.AT_LEAST_ONE_OF_GUARD,
    });

    for (const key of Object.keys(gqlContext.getArgs())) {
      if (KEY_LIST.includes(key)) return true;
    }
    throw new BadRequestException(
      `should exist at least one of ${KEY_LIST.join(', ')}`,
    );
  }
}
export function AtLeastOneArgsOf<T>(keyList: readonly (keyof T)[]) {
  const { KEY_LIST } = META_DATA.AT_LEAST_ONE_OF_GUARD;
  return applyDecorators(
    SetMetadata(KEY_LIST, keyList),
    UseGuards(AtLeastOneArgsOfGuard),
  );
}
