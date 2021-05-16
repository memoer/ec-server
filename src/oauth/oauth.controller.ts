import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserOutput } from '~/user/dto';
import { OAuthService } from './oauth.service';

@Controller('api/oauth')
export class OAuthController {
  constructor(private readonly _oauthService: OAuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Express.Request): Promise<CreateUserOutput> {
    return this._oauthService.oauthCallback(req);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuthCallback(@Req() req: Express.Request): Promise<CreateUserOutput> {
    return this._oauthService.oauthCallback(req);
  }
}
