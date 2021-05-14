import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy';
import { authConfig } from '~/@config/register';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '~/user/entity';
import { UserModule } from '~/user/user.module';
import { JwtModule } from '~/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, JwtModule],
  controllers: [AuthController],
  providers: [
    { provide: authConfig.KEY, useFactory: authConfig },
    AuthService,
    GoogleStrategy,
  ],
})
export class AuthModule {}
