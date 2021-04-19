import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import ConfigModule from './@config/config.module';
import DBModule from './@database/db.module';

@Module({
  imports: [
    ConfigModule,
    DBModule,
    ThrottlerModule.forRoot({
      ttl: Number(process.env.THROTTLER_TTL),
      limit: Number(process.env.THROTTLER_LIMIT),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
