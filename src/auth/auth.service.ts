import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '~/jwt/jwt.service';
import { UserInfo, UserInfoRelation, UserProvider } from '~/user/entity';
import { UserService } from '~/user/user.service';
import { exception } from '~/_lib';
import { ValidateProfile } from './strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly _userInfoRepo: Repository<UserInfo>,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async authCallback({ user }: Express.Request) {
    if (!user) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AuthService.oauthCallback',
        msg: 'no user',
      });
    }
    const { id, provider } = user as ValidateProfile;
    const userInfo = await this._userInfoRepo.findOne({
      where: { oauthId: id },
      relations: [UserInfoRelation.user],
    });
    if (!userInfo) {
      return this._userService.createUser(
        {
          oauthId: id,
          password: '',
        },
        UserProvider[provider.toUpperCase() as UserProvider],
        '',
      );
    }
    return {
      data: userInfo[UserInfoRelation.user],
      token: this._jwtService.sign(userInfo[UserInfoRelation.user].id),
    };
  }
}
