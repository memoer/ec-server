import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const LoggedInUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    GqlExecutionContext.create(context).getContext().req.user,
);
