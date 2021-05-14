import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleAuthCallback(user: any) {
    if (!user) {
      return 'No User From Goolge';
    }
    return { user: user };
  }
}
