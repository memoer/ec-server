import { Global, Module } from '@nestjs/common';
import { appConfig } from '~/@config/register';
import { JwtService } from './jwt.service';

@Global()
@Module({
  providers: [JwtService, { provide: appConfig.KEY, useFactory: appConfig }],
  exports: [JwtService],
})
export class JwtModule {}
