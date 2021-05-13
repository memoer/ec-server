import {
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  catch(exception: { message: any; name: any }) {
    const isHttpException = exception instanceof HttpException;
    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException(exception.message, exception.name);
    if (httpException.getStatus() < 500) return httpException;
    // ! 500 이상 에러만 확인
    // ! 에러 테스트해보기 -> 요청할 때의 args 도 sentry에 출력되어야 한다. [ 테스트 아직 안해봄 ]
    switch (process.env.NODE_ENV) {
      case 'local':
      case 'dev':
        console.info(`isHttpException: ${isHttpException}`);
        console.error(httpException);
        break;
      case 'staging':
      case 'prod':
        Sentry.withScope((scope) => {
          scope.setTag('status', 500);
          scope.setTag('isHttpException', isHttpException);
          Sentry.captureException(exception);
        });
        break;
    }
    return httpException;
  }
}
