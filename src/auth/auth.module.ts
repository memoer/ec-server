import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from '~/user/entity';
import { UserModule } from '~/user/user.module';
import { JwtModule } from '~/jwt/jwt.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy, GoogleStrategy, KakaoStrategy } from './strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, FacebookStrategy, KakaoStrategy],
})
export class AuthModule {}
