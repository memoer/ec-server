import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '~/jwt/jwt.service';
import { User, UserProvider } from '~/user/entity';
import { UserService } from '~/user/user.service';
import { exception } from '~/_lib';
import { GoogleUser } from './strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async googleAuthCallback({ user }: Express.Request) {
    if (!user) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AuthService.googleAuthCallback',
        msg: 'user not found',
      });
    }
    const { nickname, thumbnail, email, oauthId, locale } = user as GoogleUser;
    const userFromDB = await this._userRepo.findOne({
      where: { email },
    });
    if (!userFromDB) {
      return this._userService.createUser(
        {
          nickname,
          thumbnail,
          email,
          oauthId,
          locale,
          password: '',
        },
        UserProvider.GOOGLE,
      );
    }
    return {
      data: userFromDB,
      token: this._jwtService.sign(userFromDB.id),
    };
  }
}
