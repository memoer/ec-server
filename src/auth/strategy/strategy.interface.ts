import { UserProvider } from '~/user/entity';

export interface ValidateProfile {
  provider: Lowercase<Exclude<UserProvider, 'LOCAL'>>;
  id: string;
}

export interface GoogleOauthInfo {
  provider: Extract<ValidateProfile['provider'], 'google'>;
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

export interface FacebookOauthInfo {
  id: string;
  displayName: string;
  gender: undefined;
  profileUrl: undefined;
  provider: Extract<ValidateProfile['provider'], 'facebook'>;
}

export interface KakaoOauthInfo {
  provider: Extract<ValidateProfile['provider'], 'kakao'>;
  id: number;
  username: string; // '미연동 계정'
  displayName: string; // '미연동 계정'
  _json: { id: number; connected_at: Date };
}
