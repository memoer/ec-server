import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { CallbackOutputData } from '../dto/callback.dto';
import { UserProvider } from '~/user/entity';
import { commonValidate, getAuthEnv } from '../lib/commonFn';

@Injectable()
export class KakaoStrategy extends PassportStrategy(
  Strategy,
  UserProvider.KAKAO,
) {
  constructor() {
    super(getAuthEnv(UserProvider.KAKAO));
  }
  validate(_: string, __: string, profile: CallbackOutputData, done: any) {
    return commonValidate(_, __, profile, done);
  }
}
