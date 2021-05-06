import {
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    // ! 에러 테스트해보기 -> 요청할 때의 args 도 sentry에 출력되어야 한다.
    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException(exception);
    const status = httpException.getStatus();
    if (status >= 500) {
      Sentry.withScope((scope) => {
        scope.setTag('status', status.toString());
        Sentry.captureException(httpException);
      });
    }
    return httpException;
  }
}
