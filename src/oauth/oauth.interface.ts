export interface OauthInfoUser {
  oauthId: string;
  provider: 'google' | 'kakao';
  [key: string]: any;
}
