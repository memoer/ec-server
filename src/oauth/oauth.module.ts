import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { GoogleStrategy, KakaoStrategy } from './strategy';
import { authConfig } from '~/@config/register';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from '~/user/entity';
import { UserModule } from '~/user/user.module';
import { JwtModule } from '~/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfo]), UserModule, JwtModule],
  controllers: [OAuthController],
  providers: [
    { provide: authConfig.KEY, useFactory: authConfig },
    OAuthService,
    GoogleStrategy,
    KakaoStrategy,
  ],
})
export class OAuthModule {}
