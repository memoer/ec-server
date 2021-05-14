import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '~/jwt/jwt.service';
import { UserInfo, UserInfoRelation, UserOAuth } from '~/user/entity';
import { UserService } from '~/user/user.service';
import { exception } from '~/_lib';
import { GoogleUser } from './strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly _userInfoRepo: Repository<UserInfo>,
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
    const { email, nickname, thumbnail } = user as GoogleUser;
    const userFromDB = await this._userInfoRepo.findOne({
      where: { oauthId: email },
      relations: [UserInfoRelation.user],
    });
    if (!userFromDB) {
      return this._userService.createUser(
        {
          nickname,
          password: '',
          thumbnail,
          oauthId: email,
        },
        UserOAuth.GOOGLE,
      );
    }
    return {
      data: userFromDB[UserInfoRelation.user],
      token: this._jwtService.sign(userFromDB[UserInfoRelation.user].id),
    };
  }
}
