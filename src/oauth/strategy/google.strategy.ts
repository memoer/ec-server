import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '~/@config/register';

interface GoogleOauthInfo {
  provider: 'google';
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: [{ value: string; verified: boolean }];
  photos: [
    {
      value: string;
    },
  ];
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    readonly _oauthConfig: ConfigType<typeof authConfig>,
  ) {
    super({
      clientID: _oauthConfig.GOOGLE_CLIENT_ID,
      clientSecret: _oauthConfig.GOOGLE_SECRET_KEY,
      callbackURL: _oauthConfig.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  validate(
    _: string,
    __: string,
    profile: GoogleOauthInfo,
    done: VerifyCallback,
  ): any {
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
