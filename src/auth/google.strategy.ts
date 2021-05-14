import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '~/@config/register';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(readonly _authConfig: ConfigType<typeof authConfig>) {
    super({
      clientID: _authConfig.GOOGLE_CLIENT_ID,
      clientSecret: _authConfig.GOOGLE_SECRET_KEY,
      callbackURL: _authConfig.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    _: string,
    profile: any,
    done: VerifyCallback,
  ): any {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      nickname: `${name.familyName} ${name.givenName}`,
      thumbnail: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
