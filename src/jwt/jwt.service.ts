import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { appConfig } from '~/@config/register';
import { User } from '~/user/entity';

@Injectable()
export class JwtService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
  ) {}
  sign(userId: User['id']) {
    const token = jwt.sign({ id: userId }, this._appConfig.JWT_PRIVATE_KEY);
    return token;
  }
  verify(token: string): string | Record<string, any> {
    return jwt.verify(token, this._appConfig.JWT_PRIVATE_KEY);
  }
}
