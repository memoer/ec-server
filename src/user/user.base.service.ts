import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { UserEntity } from '~/@database/entities/user.entity';
import { UtilService } from '~/util/util.service';
import { nicknameList } from './util';
import { SendCodeNSetToRedis } from './user.base.service.interface';
import { AwsService } from '~/aws/aws.service';
import exception from '~/_lib/exception';

export class UserBaseService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly _user: Repository<UserEntity>,
    protected readonly _utilService: UtilService,
    @Inject(CACHE_MANAGER) protected readonly _cacheManager: Cache,
    protected readonly _awsService: AwsService,
  ) {}

  protected async _getUniqueNickname() {
    const randIdx = this._utilService.getRandNum(0, nicknameList.length);
    const nickname = nicknameList[randIdx];
    const [data] = await this._user.find({
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

  protected async _sendCodeNSetToRedis({
    phoneNumber,
    newUser,
  }: SendCodeNSetToRedis) {
    // * 1. get code
    let code;
    while (true) {
      code = String(Math.floor(100000 + Math.random() * 900000));
      if (!this._cacheManager.get(code)) break;
    }
    try {
      // * 2. set code to redis ( with newUser )
      const ttl = this._utilService.getMs({ value: 3, type: 'minute' }) / 1000;
      await this._cacheManager.set(code, newUser, { ttl });
      // * 3. send code to phone
      await this._awsService.sendSMS({
        Message: `[End Coummnity] 인증번호 [${code}]를 입력해주세요.`,
        PhoneNumber: phoneNumber,
      });
    } catch (error) {
      if (this._cacheManager.get(code)) await this._cacheManager.del(code);
      throw exception({
        type: 'InternalServerErrorException',
        name: 'UserBaseService/_sendCodeNSetToRedis',
        error,
      });
    }
  }
}
