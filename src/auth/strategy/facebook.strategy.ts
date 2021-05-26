import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { CallbackOutputData } from '../dto/callback.dto';
import { UserProvider } from '~/user/entity';
import { commonValidate, getAuthEnv } from '../lib/commonFn';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  UserProvider.FACEBOOK,
) {
  constructor() {
    super(getAuthEnv(UserProvider.FACEBOOK));
  }
  validate(_: string, __: string, profile: CallbackOutputData, done: any) {
    return commonValidate(_, __, profile, done);
  }
}
