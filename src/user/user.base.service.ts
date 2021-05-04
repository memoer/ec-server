import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository, UpdateResult } from 'typeorm';
import { Cache } from 'cache-manager';
import { User } from '~/@database/entities/user.entity';
import { UtilService } from '~/util/util.service';
import { AwsService } from '~/aws/aws.service';
import { JwtService } from '~/jwt/jwt.service';
import { nicknameList } from './util';
import { UserInfo } from '~/@database/entities/user.info.entity';
import exception from '~/_lib/exception';
import { RemoveOrRestore } from './user.service.interface';

export class UserBaseService {
  constructor(
    @InjectRepository(User)
    protected readonly _userRepo: Repository<User>,
    @InjectRepository(UserInfo)
    protected readonly _userInfoRepo: Repository<UserInfo>,
    protected readonly _utilService: UtilService,
    @Inject(CACHE_MANAGER) protected readonly _cacheManager: Cache,
    protected readonly _awsService: AwsService,
    protected readonly _jwtService: JwtService,
    protected readonly _dbConn: Connection,
  ) {}

  public getUserById(id: number) {
    return this._userRepo.findOne(id);
  }

  protected async _getUniqueNickname() {
    const randIdx = this._utilService.getRandNum(0, nicknameList.length);
    const nickname = nicknameList[randIdx];
    const [data] = await this._userRepo.find({
      select: ['nickname'],
      where: { nickname: Like(`${nickname}%`) },
      take: 1,
      order: { nickname: 'DESC' },
    });
    if (data) {
      const [, number] = data.nickname.split(nickname);
      return `${nickname}${Number(number) + 1}`;
    }
    return nickname;
  }

  protected async _getVerifyCode() {
    while (true) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      if (!(await this._cacheManager.get(code))) return code;
    }
  }

  protected async _verifyCodeInCacheIsValidThrow(
    key: string,
  ): Promise<boolean> {
    const cache = (await this._cacheManager.get(key)) as boolean;
    if (!cache) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/createUser',
        msg: 'verifyCode stored cache must be checked',
      });
    }
    return cache;
  }
  async _removeOrRestore({ userId, nickname, type, reason }: RemoveOrRestore) {
    const title = type === 'restore' ? '복귀' : '탈퇴';
    const promiseArr = [
      reason &&
        this._userInfoRepo.update(nickname, {
          reason: `[${title}] ${reason}`,
        }),
      type === 'restore'
        ? this._userRepo.restore(userId)
        : this._userRepo.softDelete(userId),
    ].filter(Boolean) as Promise<UpdateResult>[];
    const [result] = await Promise.all(promiseArr);
    return result;
  }
}
