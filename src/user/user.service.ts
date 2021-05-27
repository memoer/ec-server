import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Like } from 'typeorm';
import * as libphonenumber from 'libphonenumber-js';
import {
  exception,
  DEFAULT_VALUE,
  UploadedFilesInput,
  ErrorCode,
} from '~/_lib';
import { User, UserInfo } from './entity';
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
        code: ErrorCode.invalid,
      });
    }
    return this._jwtService.sign(user.id);
  }

  async sendVerifyCodeUser({
    phoneNumber = '',
    email = '',
  }: SendVerifyCodeUserInput) {
    if (phoneNumber === '' && email === '') return false;
    const key = phoneNumber ? 'phoneNumber' : 'email';
    const value = key === 'phoneNumber' ? phoneNumber : email;
    const user = await this._userRepo.findOne({ where: { [key]: value } });
    if (user) {
      throw exception({
        type: 'ConflictException',
        loc: 'UserService.sendVerifyCodeUser',
        code: ErrorCode.conflict,
      });
    }
    const isEmail = key.includes('@');
    const verifyCode = await this._getVerifyCode();
    const message = `[End Coummnity] 인증번호 [${verifyCode}]를 입력해주세요.`;
    const ttl =
      this._utilService.getMs({ value: isEmail ? 30 : 3, type: 'minute' }) /
      1000;
    await this._cacheManager.set(value, verifyCode, { ttl });
    // message;
    // InternalServerErrorException;
    // console.log(value, verifyCode);
    try {
      if (!isEmail) {
        await this._awsService.sendSMS({
          Message: message,
          PhoneNumber: value,
        });
      } else {
        await this._awsService.sendEmail({
          to: value,
          subject: '[End Coumminty] 이메일 확인',
          text: message,
        });
      }
    } catch (error) {
      if (this._cacheManager.get(value)) {
        await this._cacheManager.del(value);
      }
      throw new InternalServerErrorException(error);
    }
    return true;
  }

  async checkVerifyCodeUser({
    email = '',
    phoneNumber = '',
    verifyCode,
  }: CheckVerifyCodeUserInput) {
    if (phoneNumber === '' && email === '') return false;
    const key = email || phoneNumber;
    const cache = await this._cacheManager.get(key);
    if (cache !== verifyCode) {
      throw exception({
        type: 'UnauthorizedException',
        loc: 'UserService.createUser',
        code: ErrorCode.invalid,
      });
    }
    const ttl = this._utilService.getMs({ value: 30, type: 'minute' }) / 1000;
    await this._cacheManager.set(key, true, { ttl });
    return true;
  }

  // ? create local user
  async createUser({
    phoneNumber,
    gender,
    birthDate,
    email,
    oauthId,
    provider,
    password,
  }: CreateUserInput) {
    await this._checkVerifyCodeOrFail(phoneNumber);
    const newUserEntity = this._userRepo.create({
      phoneNumber,
      gender,
      birthDate,
      email,
      nickname: await this.getUniqueNickname(),
      password,
    });
    const newUserInfoEntity = this._userInfoRepo.create({
      provider,
      oauthId,
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
    if (phoneNumber) {
      await this._cacheManager.del(phoneNumber);
    }
    return { data: newUser, token: this._jwtService.sign(newUser.id) };
  }

  findAllUser({
    pageNumber = DEFAULT_VALUE.PAGE_NUMBER,
    take = DEFAULT_VALUE.TAKE,
    email,
    nickname,
    gender,
  }: FindAllUserInput) {
    return this._userRepo.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
      where: {
        ...(email && { email: Like(`%${email}%`) }),
        ...(nickname && { nickname: Like(`%${nickname}%`) }),
        ...(gender && { gender }),
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
    {
      nickname,
      phoneNumber,
      email,
      password,
      birthDate,
      gender,
    }: UpdateUserInput,
    { thumbnail }: UploadedFilesInput<'thumbnail'>,
  ) {
    // ! phoneNumber 등록할 때, update local
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
      gender,
      thumbnail: thumbnail?.[0],
    });
    if (phoneNumber) {
      const { country } = libphonenumber.parse(phoneNumber);
      return this._dbConn.transaction('SERIALIZABLE', async (manager) => {
        await manager.update(UserInfo, user.id, { country });
        return manager.save(User, updatedUser);
      });
    }
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
        code: ErrorCode.invalid,
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
