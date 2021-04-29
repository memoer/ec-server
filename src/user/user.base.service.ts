import { BadRequestException, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import parsePhoneNumber from 'libphonenumber-js';
import { UserEntity } from '~/@database/entities/user.entity';
import { UtilService } from '~/util/util.service';
import { nicknameList } from './util';
import {
  SetVerifyCodeToRedis,
  SendVerifyCode,
} from './user.base.service.interface';
import { AwsService } from '~/aws/aws.service';
import { TGeoInfo } from '~/_lib/decorator/geo-info.decorator';
import exceptionTemplate from '~/_lib/exceptionTemplate';

export class UserBaseService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly _user: Repository<UserEntity>,
    protected readonly _utilService: UtilService,
    @Inject(CACHE_MANAGER) protected readonly _cacheManager: Cache,
    protected readonly _awsService: AwsService,
  ) {}
  //
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
  protected _genVerifyNumber(): number {
    while (true) {
      const value = Math.floor(100000 + Math.random() * 900000);
      if (!this._cacheManager.get(String(value))) return value;
    }
  }
  protected _getInternationalPhoneNumber(
    phoneNumber: string,
    geoInfo: TGeoInfo,
  ) {
    const data = parsePhoneNumber(
      phoneNumber,
      geoInfo.country.toUpperCase() as any,
    );
    if (!data) {
      throw new BadRequestException(
        exceptionTemplate({
          area: 'Servie',
          name: 'UserBase',
          msg: 'no parsedPhoneNumber data',
        }),
      );
    }
    return data.number;
  }
  protected async _sendVerifyCode({
    code,
    PhoneNumber,
  }: SendVerifyCode['args']) {
    const Message = `[End Coummnity] 인증번호 [${code}]를 입력해주세요.`;
    return this._awsService.sendSMS({ Message, PhoneNumber });
  }
  protected async _setVerifyCodeToRedis({
    code,
    data,
  }: SetVerifyCodeToRedis['args']) {
    const ttl = this._utilService.getMs({ value: 3, type: 'minute' }) / 1000;
    return this._cacheManager.set(String(code), data, { ttl });
  }
}
