import {
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';
import isEnv from '../isEnv';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
  errorLog(
    type: 'log' | 'sentry',
    exception: Error,
    isHttpException?: boolean,
  ) {
    if (type === 'log') {
      if (isHttpException) console.info(`isHttpException: ${isHttpException}`);
      console.error(exception);
    } else {
      Sentry.withScope((scope) => {
        scope.setTag('status', 500);
        if (isHttpException) scope.setTag('isHttpException', isHttpException);
        scope.setTag('captureLocation', 'globalExceptionFilter');
        Sentry.captureException(exception);
      });
    }
  }
  catchError(httpException: HttpException, isHttpException: boolean) {
    if (
      (isEnv('staging') || isEnv('prod')) &&
      httpException.getStatus() < 500
    ) {
      return HttpException;
    }
    // ! 에러 테스트해보기 -> 요청할 때의 args 도 sentry에 출력되어야 한다. [ 테스트 아직 안해봄 ]
    switch (process.env.NODE_ENV) {
      case 'local':
      case 'dev':
        this.errorLog('log', httpException, isHttpException);
        break;
      case 'staging':
      case 'prod':
        this.errorLog('sentry', httpException, isHttpException);
        break;
    }
    return httpException;
  }
  catch(exception: { message: any; name: any; code?: string }) {
    const httpException =
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException(exception.message, exception.name);
    return this.catchError(httpException, exception instanceof HttpException);
  }
}
