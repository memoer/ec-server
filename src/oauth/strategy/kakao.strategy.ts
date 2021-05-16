import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '~/@config/register';

interface KakaoOauthInfo {
  provider: 'kakao';
  id: number;
  username: string; // '미연동 계정'
  displayName: string; // '미연동 계정'
  _json: { id: number; connected_at: Date };
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @Inject(authConfig.KEY)
    readonly _oauthConfig: ConfigType<typeof authConfig>,
  ) {
    super({
      clientID: _oauthConfig.KAKAO_CLIENT_ID,
      clientSecret: _oauthConfig.KAKAO_SECRET_KEY,
      callbackURL: _oauthConfig.KAKAO_CALLBACK,
    });
  }

  validate(_: string, __: string, profile: KakaoOauthInfo, done: any): any {
    const { provider, id } = profile;
    const user = {
      oauthId: String(id),
      provider,
    };
    done(null, user);
  }
}
