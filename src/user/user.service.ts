import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '~/@database/entities/user.entity';
import { PaginationInput } from '~/util/dto/pagination.dto';
import { verifyBeforeCreateUserInput } from './dto/verifyBeforeCreateUser.dto';
import { LogInInput } from './dto/logInUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { UserBaseService } from './user.base.service';
import { NewUser } from './user.base.service.interface';
import exception from '~/_lib/exception';

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
    const [result] = await Promise.all([newUser, delCache]);
    return result;
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

  async removeUser(id: number) {
    // * 탈퇴한 이유
    return this._user.softDelete(id);
  }

  async restoreUser(id: number) {
    // * 다시 돌아온 이유
    return this._user.restore(id);
  }
}
