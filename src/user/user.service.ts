import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UserRole, UserStatus } from '~/@database/entities/user.entity';
import { PaginationInput } from '~/util/dto/pagination.dto';
import exception from '~/_lib/exception';
import { verifyBeforeCreateUserInput } from './dto/verifyBeforeCreateUser.dto';
import { LogInInput } from './dto/logInUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { UserBaseService } from './user.base.service';
import { NewUser } from './user.service.interface';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';

@Injectable()
export class UserService extends UserBaseService {
  async logIn(input: LogInInput) {
    console.log(input);
  }

  async verifyBeforeCreateUser(input: verifyBeforeCreateUserInput) {
    if (input.oauth && input.password) {
      throw exception({
        type: 'BadRequestException',
        name: 'UserService/verifyBeforeCreateUser',
        msg: 'wrong create user process',
      });
    }
    const nickname = await this._getUniqueNickname();
    const newUser = {
      ...input,
      nickname,
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    };
    await this._sendCodeNSetToRedis({
      phoneNumber: input.phoneNumber,
      newUser,
    });
    return true;
  }

  async verifyAfterCreateUser(code: string) {
    const cache = (this._cacheManager.get(code) as unknown) as NewUser;
    const newUser = this._user.save(this._user.create(cache));
    const delCache = this._cacheManager.del(code);
    const [data] = await Promise.all([newUser, delCache]);
    const token = this._jwtService.sign(data.id);
    return { data, token };
  }

  findAllUser({ pageNumber, take }: PaginationInput) {
    return this._user.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
    });
  }

  async findOneUser(id: number) {
    // * 누가 누굴 검색했는 지
    return this._user.findOne({ id });
  }

  async updateUser(id: number, updateUserInput: Omit<UpdateUserInput, 'id'>) {
    return this._user.update(id, updateUserInput);
  }

  async removeUser({ id, reason }: RemoveUserInput) {
    const promiseArr = [
      reason && this._userInfo.update({ userId: id }, { reason }),
      this._user.softDelete(id),
    ].filter(Boolean) as Promise<UpdateResult>[];
    const [result] = await Promise.all(promiseArr);
    return result;
  }

  async restoreUser({ id, reason }: RestoreUserInput) {
    const promiseArr = [
      reason && this._userInfo.update({ userId: id }, { reason }),
      this._user.restore(id),
    ].filter(Boolean) as Promise<UpdateResult>[];
    const [result] = await Promise.all(promiseArr);
    return result;
  }
}
