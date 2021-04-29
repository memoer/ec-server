import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '~/@database/entities/user.entity';
import { PaginationInput } from '~/util/dto/pagination.dto';
import { verifyBeforeCreateUserInput } from './dto/verifyBeforeCreateUser.dto';
import { LogInInput } from './dto/logInUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { UserBaseService } from './user.base.service';
import { NewUser } from './user.base.service.interface';
import { TGeoInfo } from '~/_lib/decorator/geo-info.decorator';
import exceptionTemplate from '~/_lib/exceptionTemplate';

@Injectable()
export class UserService extends UserBaseService {
  async logIn(input: LogInInput) {
    console.log(input);
  }

  async verifyBeforeCreateUser(
    geoInfo: TGeoInfo,
    input: verifyBeforeCreateUserInput,
  ) {
    if (input.oauth && input.password) {
      throw new BadRequestException(
        exceptionTemplate({
          area: 'Servie',
          name: 'user',
          msg: `wrong create user process`,
        }),
      );
    }
    const nickname = await this._getUniqueNickname();
    const newUser = {
      ...input,
      nickname,
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    };
    const code = this._genVerifyNumber();
    const phoneNumber = this._getInternationalPhoneNumber(
      input.phoneNumber,
      geoInfo,
    );
    await this._sendVerifyCode({ code, PhoneNumber: String(phoneNumber) });
    await this._setVerifyCodeToRedis({ code, data: newUser });
    return true;
  }

  async verifyAfterCreateUser(verifyCode: number) {
    const newUser = (this._cacheManager.get(
      String(verifyCode),
    ) as unknown) as NewUser;
    const userEntity = this._user.create(newUser);
    return this._user.save(userEntity);
  }

  findAllUser({ pageNumber, take }: PaginationInput) {
    return this._user.findAndCount({
      take,
      skip: this._utilService.getSkip({ pageNumber, take }),
    });
  }

  async findOneUser(id: number) {
    return this._user.findOne({ id });
  }

  async updateUser(id: number, updateUserInput: Omit<UpdateUserInput, 'id'>) {
    return this._user.update(id, updateUserInput);
  }

  async removeUser(id: number) {
    return this._user.softDelete(id);
  }

  async restoreUser(id: number) {
    return this._user.restore(id);
  }
}
