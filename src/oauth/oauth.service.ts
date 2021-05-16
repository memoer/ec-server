import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '~/jwt/jwt.service';
import { UserInfo, UserInfoRelation, UserProvider } from '~/user/entity';
import { UserService } from '~/user/user.service';
import { exception } from '~/_lib';
import { OauthInfoUser } from './oauth.interface';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly _userInfoRepo: Repository<UserInfo>,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  async oauthCallback({ user }: Express.Request) {
    if (!user) {
      throw exception({
        type: 'NotFoundException',
        loc: 'OAuthService.oauthCallback',
        msg: 'user not found',
      });
    }
    const { oauthId, provider } = user as OauthInfoUser;
    const userInfo = await this._userInfoRepo.findOne({
      where: { oauthId },
      relations: [UserInfoRelation.user],
    });
    if (!userInfo) {
      return this._userService.createUser(
        {
          oauthId,
          password: '',
          nickname: await this._userService.getUniqueNickname(),
        },
        UserProvider[
          provider.toUpperCase() as Uppercase<OauthInfoUser['provider']>
        ],
      );
    }
    return {
      data: userInfo[UserInfoRelation.user],
      token: this._jwtService.sign(userInfo[UserInfoRelation.user].id),
    };
  }
}
