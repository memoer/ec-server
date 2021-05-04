import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationInput } from '~/util/dto/pagination.dto';
import exception from '~/_lib/exception';
import { CreateUserInput } from './dto/createUser.dto';
import { LogInUserInput } from './dto/logInUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { UserBaseService } from './user.base.service';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';
import { CheckVerifyCodeUserInput } from './dto/checkVerfiyCodeUser.dto';
import { SendVerifyCodeUserInput } from './dto/sendVerifyCodeUser.dto';
import { FindOneUserInput } from './dto/findOneUser.dto';
import { UpdatePhoneOrEmailUserInput } from './dto/updatePhoneOrEmailUser.dto';
import { ReqUser } from '~/@graphql/graphql.interface';

@Injectable()
export class UserService extends UserBaseService {
  async logInUser({ nickname, phoneNumber, password }: LogInUserInput) {
    const user = await this._userRepo.findOne({ nickname, phoneNumber });
    if (!user) {
      throw exception({
        type: 'NotFoundException',
        name: 'UserService/logIn',
        msg: `user of ${nickname || phoneNumber} is not found`,
      });
    } else if (!(await user.verifyPassword(password))) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/logIn',
        msg: 'password invalid',
      });
    }
    return { data: user, token: this._jwtService.sign(user.id) };
  }

  async sendVerifyCodeUser({ phoneNumber, email }: SendVerifyCodeUserInput) {
    const key = (phoneNumber || email)!;
    const verifyCode = await this._getVerifyCode();
    const message = `[End Coummnity] 인증번호 [${verifyCode}]를 입력해주세요.`;
    const ttl = this._utilService.getMs({ value: 3, type: 'minute' }) / 1000;
    await this._cacheManager.set(key, verifyCode, { ttl });
    try {
      const isEmail = key.includes('@');
      if (isEmail) {
        this._awsService.sendEmail({
          to: key,
          subject: '[End Coumminty] 이메일 확인',
          text: message,
        });
      } else {
        this._awsService.sendSMS({
          Message: message,
          PhoneNumber: key,
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

  async checkVerifyCodeUser({ key, verifyCode }: CheckVerifyCodeUserInput) {
    const cache = await this._cacheManager.get(key);
    if (cache !== verifyCode) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/createUser',
        msg: 'served verifyCode invalid',
      });
    }
    const ttl = this._utilService.getMs({ value: 30, type: 'minute' }) / 1000;
    await this._cacheManager.set(key, true, { ttl });
    return true;
  }

  async createUser({
    phoneNumber,
    sex,
    birthDate,
    password,
    country,
  }: CreateUserInput) {
    const nickname = await this._getUniqueNickname();
    await this._verifyCodeInCacheIsValidThrow(phoneNumber);
    const newUserInfo = this._userInfoRepo.create({
      country,
      nickname,
    });
    const newUser = this._userRepo.create({
      phoneNumber,
      sex,
      birthDate,
      password,
      nickname,
      info: newUserInfo,
    });
    const data = await this._dbConn.transaction(
      'SERIALIZABLE',
      async (manager) => {
        await manager.save(newUserInfo);
        return manager.save(newUser);
      },
    );
    await this._cacheManager.del(phoneNumber);
    return { data, token: this._jwtService.sign(data.id) };
  }

  findAllUser({ pageNumber, take }: PaginationInput) {
    return this._userRepo.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
    });
  }

  async findOneUser(input: FindOneUserInput) {
    const data = await this._userRepo.findOne({ ...input });
    if (!data) {
      throw exception({
        type: 'NotFoundException',
        name: 'UserService/findOneUser',
        msg: 'user is not found',
      });
    }
    return data;
  }

  async updateUser(userId: number, input: UpdateUserInput) {
    return this._userRepo.update(userId, input);
  }

  async updatePhoneOrEmailUser(
    userId: number,
    input: UpdatePhoneOrEmailUserInput,
  ) {
    await this._verifyCodeInCacheIsValidThrow(Object.values(input)[0]);
    return this._userRepo.update(userId, input);
  }

  async removeUser(user: ReqUser, { reason }: RemoveUserInput) {
    return this._removeOrRestore({
      type: 'remove',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
  }

  async restoreUser(user: ReqUser, { reason }: RestoreUserInput) {
    return this._removeOrRestore({
      type: 'restore',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
  }
}
