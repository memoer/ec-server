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
import { UserRole } from 'aws-sdk/clients/workmail';
import { Observable } from 'rxjs';
import { META_DATA } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const {
      req: { user },
    } = GqlExecutionContext.create(context).getContext();
    const roles = this._reflector.getAllAndOverride<UserRole[]>(
      META_DATA.ROLES,
      [context.getHandler(), context.getClass()],
    );
    return !roles ? !!user : roles.some((r) => user.role.includes(r));
  }
}

export function authGuard(roles?: UserRole[]) {
  return applyDecorators(
    SetMetadata(META_DATA.ROLES, roles),
    UseGuards(AuthGuard),
  );
}