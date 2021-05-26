import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { CallbackOutputData } from '../dto/callback.dto';
import { UserProvider } from '~/user/entity';
import { commonValidate, getAuthEnv } from '../lib/commonFn';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  UserProvider.GOOGLE,
) {
  constructor() {
    super(getAuthEnv(UserProvider.GOOGLE));
  }
  validate(_: string, __: string, profile: CallbackOutputData, done: any) {
    return commonValidate(_, __, profile, done);
  }
}
