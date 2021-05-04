import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const upperCaseMiddleware: FieldMiddleware = async (
  _: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();
  console.log(value, value.toUpperCase());
  return (<string>value).toUpperCase();
};
