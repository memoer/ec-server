import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Like } from 'typeorm';
import { exception, DEFAULT_VALUE, UploadedFilesInput } from '~/_lib';
import { User, UserProvider } from './entity';
import { UserBaseService } from './user.base.service';
import {
  CreateUserInput,
  LogInUserInput,
  UpdateUserInput,
  RemoveUserInput,
  RestoreUserInput,
  CheckVerifyCodeUserInput,
  SendVerifyCodeUserInput,
  FindOneUserInput,
  FindAllUserInput,
} from './dto';

@Injectable()
export class UserService extends UserBaseService {
  async logInUser({ password, nickname, phoneNumber }: LogInUserInput) {
    const user = await this._userRepo.findOneOrFail(
      this._utilService.removeUndefinedOf({ nickname, phoneNumber }),
      { select: ['id', 'password'] },
    );
    if (!(await user.verifyPassword(password))) {
      throw exception({
        type: 'UnauthorizedException',
        loc: 'UserService.logIn',
        msg: 'password invalid',
      });
    }
    return this._jwtService.sign(user.id);
  }

  async sendVerifyCodeUser({ phoneNumber, email }: SendVerifyCodeUserInput) {
    const key = phoneNumber ? 'phoeNumber' : 'email';
    // ? 마지막 '' 넣은 이유는 key 타입에서 `undefined`를 제거하기 위함
    // ? 어차피 `sendVerifyCodeUser`가 호출되기 전,
    // ? resolver에서 phoeNumber, email 중 하나라도 넣지 않으면 여기로 들어오지도 않음
    const value = phoneNumber || email || '';
    const user = await this._userRepo.findOne({ where: { [key]: value } });
    if (user) {
      throw exception({
        type: 'ConflictException',
        loc: 'UserService.sendVerifyCodeUser',
        msg: `user with ${key}:${value} is already existed`,
      });
    }
    const isEmail = key.includes('@');
    const verifyCode = await this._getVerifyCode();
    const message = `[End Coummnity] 인증번호 [${verifyCode}]를 입력해주세요.`;
    const ttl =
      this._utilService.getMs({ value: isEmail ? 30 : 3, type: 'minute' }) /
      1000;
    await this._cacheManager.set(key, verifyCode, { ttl });
    try {
      if (!isEmail) {
        await this._awsService.sendSMS({
          Message: message,
          PhoneNumber: key,
        });
      } else {
        await this._awsService.sendEmail({
          to: key,
          subject: '[End Coumminty] 이메일 확인',
          text: message,
        });
      }
    } catch (error) {
      if (this._cacheManager.get(verifyCode)) {
        await this._cacheManager.del(verifyCode);
      }
      throw new InternalServerErrorException(error);
    }
    return true;
  }

  async checkVerifyCodeUser({
    email,
    phoneNumber,
    verifyCode,
  }: CheckVerifyCodeUserInput) {
    const key = phoneNumber || email || '';
    const cache = await this._cacheManager.get(key);
    if (cache !== verifyCode) {
      throw exception({
        type: 'UnauthorizedException',
        loc: 'UserService.createUser',
        msg: 'served verifyCode invalid',
      });
    }
    const ttl = this._utilService.getMs({ value: 30, type: 'minute' }) / 1000;
    await this._cacheManager.set(key, true, { ttl });
    return true;
  }

  // ? create local user
  async createUser(
    {
      sex,
      birthDate,
      nickname: _nickname,
      thumbnail,
      email,
      oauthId,
      locale,
      password,
    }: CreateUserInput,
    provider: UserProvider,
  ) {
    const nickname = _nickname || (await this._getUniqueNickname());
    const newUserEntity = this._userRepo.create({
      sex,
      birthDate,
      nickname,
      thumbnail,
      email,
      password,
    });
    const newUserInfoEntity = this._userInfoRepo.create({
      provider,
      oauthId,
      locale,
    });
    const newUser = await this._dbConn.transaction(
      'SERIALIZABLE',
      async (manager) => {
        const newUser = await manager.save(newUserEntity);
        newUserInfoEntity.user = newUser;
        await manager.save(newUserInfoEntity);
        return newUser;
      },
    );
    return { data: newUser, token: this._jwtService.sign(newUser.id) };
  }

  findAllUser({
    pageNumber = DEFAULT_VALUE.PAGE_NUMBER,
    take = DEFAULT_VALUE.TAKE,
    email,
    nickname,
    sex,
  }: FindAllUserInput) {
    return this._userRepo.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
      where: {
        ...(email && { email: Like(`%${email}%`) }),
        ...(nickname && { nickname: Like(`%${nickname}%`) }),
        ...(sex && { sex }),
      },
    });
  }

  async findOneUser({ nickname, email, id }: FindOneUserInput) {
    // EntityNotFound: Could not find any entity of type "User" matching
    return this._userRepo.findOneOrFail(
      this._utilService.removeUndefinedOf({ nickname, email, id }),
    );
  }

  async updateUser(
    user: User,
    { nickname, phoneNumber, email, password, birthDate, sex }: UpdateUserInput,
    { thumbnail }: UploadedFilesInput<'thumbnail'>,
  ) {
    await Promise.all(
      (<string[]>[email, phoneNumber].filter(Boolean)).map((key) =>
        this._checkVerifyCodeOrFail(key),
      ),
    );
    const updatedUser = this._userRepo.create({
      ...user,
      nickname,
      password,
      birthDate,
      sex,
      thumbnail: thumbnail?.[0],
    });
    return this._userRepo.save(updatedUser);
  }

  async removeUser(user: User, { reason }: RemoveUserInput) {
    return this._removeOrRestore({
      type: 'remove',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
  }

  async restoreUser({
    reason,
    nickname,
    phoneNumber,
    password,
  }: RestoreUserInput) {
    const user = await this._userRepo.findOneOrFail(
      this._utilService.removeUndefinedOf({ nickname, phoneNumber }),
      { withDeleted: true, select: ['id', 'nickname', 'password'] },
    );
    if (!(await user.verifyPassword(password))) {
      throw exception({
        type: 'UnauthorizedException',
        loc: 'UserService.restoreUser',
        msg: 'password invalid',
      });
    }
    return this._removeOrRestore({
      type: 'restore',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
  }
}
