import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import * as logger from 'morgan';
import * as requestIp from 'request-ip';
import { AppModule } from './app/app.module';
import {
  isEnv,
  GlobalExceptionFilter,
  EntityNotFoundExceptionFilter,
  exception,
} from './_lib';
import { NextFunction, Request, Response } from 'express';

function initLogger(app: NestExpressApplication) {
  // 로깅은 사용자 추적을 위해서 사용
  const prodFormat =
    ':remote-addr - :remote-user [:date[clf]] HTTP/:http-version :status ":referrer" ":user-agent" :response-time ms :userId';
  logger.token('userId', (req): string =>
    String('user' in req ? -1 : (req as any).user.id),
  );
  if (isEnv('prod')) {
    app.use(logger(prodFormat));
  } else if (isEnv('local') || isEnv('dev') || isEnv('staging')) {
    // 'dev' -> :method :url :status :response-time ms - :res[content-length]
    app.use(logger('dev'));
  }
}
function guardRequest(req: Request, _: Response, next: NextFunction) {
  const { origin, authorization } = req.headers;
  const auth = authorization?.split(' ');
  if (!isEnv('local')) {
    const isValid =
      auth && auth[0] === 'basic' && auth[1] === process.env.API_SECRET_KEY;
    if (origin === process.env.CORS_ORIGIN || isValid) {
      // origin 이 있을 경우 -> CORS_ORIGIN만 서버 요청 가능
      // opigin 이 없을 경우 -> 별도의 인증 필요
      return next();
    }
  } else {
    // local일 경우 pass
    return next();
  }
  throw exception({
    type: 'ForbiddenException',
    loc: 'app.use',
    msg: `${origin} is not whitelist`,
  });
}

function initSentry(app: NestExpressApplication) {
  // ! Sentry : prod, staging 둘 다 에러를 잡아야 한다.
  // staging -> prod과 제일 비슷한 환경임 -> 해당 환경에서 에러가 난다는 것은 prod에서도 에러가 날 확률이 높다.
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app: app as any }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler({ ip: true, user: ['id', 'name'] }));
  app.use(Sentry.Handlers.tracingHandler());
}

async function bootstrap() {
  const filters = [
    new GlobalExceptionFilter(),
    new EntityNotFoundExceptionFilter(),
  ];
  // 맨 뒤의 Filter 가 첫 번째 우선순위 ( 제일 먼저 잡힘 )
  const pipes = [new ValidationPipe()];
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isEnv('local') || isEnv('dev'),
  });
  app.use(guardRequest);
  initLogger(app);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(requestIp.mw());
  if (isEnv('staging') || isEnv('prod')) {
    // https://docs.nestjs.com/techniques/compression
    // For high-traffic websites in production, it is strongly recommended to offload compression from the application server
    // typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
    app.use(compression());
    initSentry(app);
  }
  app.useGlobalFilters(...filters);
  app.useGlobalPipes(...pipes);
  await app.listen(+process.env.SERVER_PORT);
}

bootstrap();
