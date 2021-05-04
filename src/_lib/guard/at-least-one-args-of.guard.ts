import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { META_DATA } from '../constants';
import exception from '../exception';

@Injectable()
export class AtLeastOneArgsOfGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { KEY_LIST } = META_DATA.AT_LEAST_ONE_OF_GUARD;
    const gqlContext = GqlExecutionContext.create(context);
    const value = this._reflector.get(KEY_LIST, context.getHandler());
    const args = gqlContext.getArgs().input;
    for (const key of Object.keys(args)) {
      if (value.includes(key)) return true;
    }
    throw exception({
      type: 'BadRequestException',
      name: 'AtLeastOneArgsOfGuard/canActive',
      msg: `should exist at least one of ${value.join(', ')}`,
    });
  }
}
export function atLeastOneArgsOfGuard<T>(keyList: readonly (keyof T)[]) {
  const { KEY_LIST } = META_DATA.AT_LEAST_ONE_OF_GUARD;
  return applyDecorators(
    SetMetadata(KEY_LIST, keyList),
    UseGuards(AtLeastOneArgsOfGuard),
  );
}
