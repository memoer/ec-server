import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class SentryExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    if (status >= 500) {
      Sentry.withScope((scope) => {
        scope.setTag('status', status.toString());
        Sentry.captureException(exception);
      });
    }
    return exception;
  }
}
