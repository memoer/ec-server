import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserOutput } from '~/user/dto';
import { UserProvider } from '~/user/entity';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly _oauthService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard(UserProvider.GOOGLE))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard(UserProvider.GOOGLE))
  googleAuthCallback(@Req() req: Express.Request): Promise<CreateUserOutput> {
    return this._oauthService.authCallback(req);
  }

  @Get('kakao')
  @UseGuards(AuthGuard(UserProvider.KAKAO))
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard(UserProvider.KAKAO))
  kakaoAuthCallback(@Req() req: Express.Request): Promise<CreateUserOutput> {
    return this._oauthService.authCallback(req);
  }

  @Get('facebook')
  @UseGuards(AuthGuard(UserProvider.FACEBOOK))
  async instagramAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard(UserProvider.FACEBOOK))
  instagramAuthCallback(
    @Req() req: Express.Request,
  ): Promise<CreateUserOutput> {
    return this._oauthService.authCallback(req);
  }
}
