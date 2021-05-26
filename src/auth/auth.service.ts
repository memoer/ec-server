import { Injectable } from '@nestjs/common';
import { exception } from '~/_lib';
import { CallbackOutputData } from './dto/callback.dto';

@Injectable()
export class AuthService {
  async authCallback({ user }: Express.Request) {
    if (!user) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AuthService.oauthCallback',
        msg: 'no user',
      });
    }
    const { id, provider } = user as CallbackOutputData;
    return { data: { id, provider } };
  }
}
