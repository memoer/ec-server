import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '~/@config/register';

export interface GoogleUser {
  oauthId: string;
  email: string;
  nickname: string;
  thumbnail: string;
  locale: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY) readonly _authConfig: ConfigType<typeof authConfig>,
  ) {
    super({
      clientID: _authConfig.GOOGLE_CLIENT_ID,
      clientSecret: _authConfig.GOOGLE_SECRET_KEY,
      callbackURL: _authConfig.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  validate(_: string, __: string, profile: any, done: VerifyCallback): any {
    const { sub, name, picture, email, locale } = profile._json;
    const user = {
      oauthId: sub,
      email,
      nickname: name,
      thumbnail: picture,
      locale,
    };
    done(null, user);
  }
}
