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
import { UserRole } from '~/user/entity/user.info.entity';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { META_DATA } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const {
      req: { user },
    } = GqlExecutionContext.create(context).getContext() as GqlCtx;
    const roles = this._reflector.getAllAndOverride<UserRole[]>(
      META_DATA.ROLES,
      [context.getHandler(), context.getClass()],
    );
    return roles.length === 0
      ? !!user
      : roles.some((r) => user.info.role.includes(r));
  }
}

export function authGuardFn(...roles: (keyof typeof UserRole)[]) {
  return applyDecorators(
    SetMetadata(META_DATA.ROLES, roles),
    UseGuards(AuthGuard),
  );
}
