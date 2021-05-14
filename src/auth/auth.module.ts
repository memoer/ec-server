import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { authConfig } from '~/@config/register';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    { provide: authConfig.KEY, useFactory: authConfig },
  ],
})
export class AuthModule {}
