import { CallbackOutputData } from '../dto/callback.dto';

export interface GoogleOauthInfo {
  provider: Extract<CallbackOutputData['provider'], 'google'>;
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
  provider: Extract<CallbackOutputData['provider'], 'facebook'>;
}

export interface KakaoOauthInfo {
  provider: Extract<CallbackOutputData['provider'], 'kakao'>;
  id: number;
  username: string; // '미연동 계정'
  displayName: string; // '미연동 계정'
  _json: { id: number; connected_at: Date };
}
