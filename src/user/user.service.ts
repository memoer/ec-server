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
import { User } from '~/@database/entities/user.entity';

@Injectable()
export class UserService extends UserBaseService {
  async logInUser({ password, ...input }: LogInUserInput) {
    const user = await this._userRepo.findOneOrFail(
      { ...input },
      { select: ['id', 'password'] },
    );
    if (!(await user.verifyPassword(password))) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/logIn',
        msg: 'password invalid',
      });
    }
    return this._jwtService.sign(user.id);
  }

  async sendVerifyCodeUser({ email }: SendVerifyCodeUserInput) {
    const verifyCode = await this._getVerifyCode();
    const message = `[End Coummnity] 인증번호 [${verifyCode}]를 입력해주세요.`;
    const ttl = this._utilService.getMs({ value: 30, type: 'minute' }) / 1000;
    await this._cacheManager.set(email, verifyCode, { ttl });
    try {
      await this._awsService.sendEmail({
        to: email,
        subject: '[End Coumminty] 이메일 확인',
        text: message,
      });
    } catch (error) {
      if (this._cacheManager.get(verifyCode)) {
        await this._cacheManager.del(verifyCode);
      }
      throw new InternalServerErrorException(error);
    }
    return true;
  }

  async checkVerifyCodeUser({ email, verifyCode }: CheckVerifyCodeUserInput) {
    const cache = await this._cacheManager.get(email);
    if (cache !== verifyCode) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/createUser',
        msg: 'served verifyCode invalid',
      });
    }
    const ttl = this._utilService.getMs({ value: 30, type: 'minute' }) / 1000;
    await this._cacheManager.set(email, true, { ttl });
    return true;
  }

  async createUser({
    email,
    sex,
    birthDate,
    password,
    country,
  }: CreateUserInput) {
    const nickname = await this._getUniqueNickname();
    await this._checkVerifyCodeOrFail(email);
    const newUserInfo = this._userInfoRepo.create({
      country,
      nickname,
    });
    const newUser = this._userRepo.create({
      email,
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
    await this._cacheManager.del(email);
    return { data, token: this._jwtService.sign(data.id) };
  }

  findAllUser({ pageNumber, take }: PaginationInput) {
    return this._userRepo.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
    });
  }

  async findOneUser(input: FindOneUserInput) {
    // EntityNotFound: Could not find any entity of type "User" matching
    return this._userRepo.findOneOrFail({ ...input });
  }

  async updateUser(user: User, input: UpdateUserInput) {
    if (input.email) {
      await this._checkVerifyCodeOrFail(input.email);
    }
    const updatedUser = this._userRepo.create({ ...user, ...input });
    return this._userRepo.save(updatedUser);
  }

  async removeUser(user: User, { reason }: RemoveUserInput) {
    await this._removeOrRestore({
      type: 'remove',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
    return true;
  }

  async restoreUser({ reason, email, password }: RestoreUserInput) {
    const user = await this._userRepo.findOneOrFail(
      { email },
      { withDeleted: true, select: ['id', 'nickname', 'password'] },
    );
    if (!(await user.verifyPassword(password))) {
      throw exception({
        type: 'ForbiddenException',
        name: 'UserService/restoreUser',
        msg: 'password invalid',
      });
    }
    await this._removeOrRestore({
      type: 'restore',
      userId: user.id,
      nickname: user.nickname,
      reason,
    });
    return true;
  }
}
