import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthMiddleware } from '~/_lib/middleware/auth.middleware';
import { GqlThrottlerGuard } from '~/_lib/guard/gql-throttler-guard.guard';
import CacheModule from '~/@cache/cache.module';
import ConfigModule from '~/@config/config.module';
import DBModule from '~/@database/db.module';
import GraphQLModule from '~/@graphql/graphql.module';
import { AwsModule } from '~/aws/aws.module';
import { JwtService } from '~/jwt/jwt.service';
import { UserModule } from '~/user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL,
      limit: +process.env.THROTTLER_LIMIT,
    }),
    CacheModule,
    ConfigModule,
    DBModule,
    GraphQLModule,
    AwsModule,
    JwtService,
    UserModule,
  ],
  providers: [
    AppResolver,
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
