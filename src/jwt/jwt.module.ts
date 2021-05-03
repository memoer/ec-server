import { Module } from '@nestjs/common';
import appConfig from '~/@config/app.config';
import { JwtService } from './jwt.service';

@Module({
  providers: [JwtService, { provide: appConfig.KEY, useFactory: appConfig }],
  exports: [JwtService],
})
export class JwtModule {}
