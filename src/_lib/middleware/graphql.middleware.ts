import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const upperCaseMiddleware: FieldMiddleware = async (
  _: MiddlewareContext,
  next: NextFn,
) => (<string>await next()).toUpperCase();
