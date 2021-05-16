import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { ValidateProfile } from './strategy.interface';
import { UserProvider } from '~/user/entity';
import { commonValidate, getAuthEnv } from './commonFn';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  UserProvider.GOOGLE,
) {
  constructor() {
    super(getAuthEnv(UserProvider.GOOGLE));
  }
  validate(_: string, __: string, profile: ValidateProfile, done: any) {
    return commonValidate(_, __, profile, done);
  }
}
