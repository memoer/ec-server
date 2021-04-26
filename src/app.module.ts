import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppResolver } from './app.resolver';
import ConfigModule from './@config/config.module';
import DBModule from './@database/db.module';
import GraphQLModule from './@graphql/graphql.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL,
      limit: +process.env.THROTTLER_LIMIT,
    }),
    ConfigModule,
    DBModule,
    GraphQLModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppResolver,
  ],
})
export class AppModule {}
