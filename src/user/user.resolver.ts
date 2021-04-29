import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { GeoInfo, TGeoInfo } from '~/_lib/decorator/geo-info.decorator';
import { UserEntity } from '~/@database/entities/user.entity';
import { PaginationOutputInterceptor } from '~/_lib/interceptor/pagination-output.interceptor';
import { CheckData, CheckDataGuardType } from '~/_lib/guard/check-data.guard';
import { AtLeastOneArgsOf } from '~/_lib/guard/at-least-one-args-of.guard';
import { UserService } from './user.service';
import { PaginationInput } from '~/util/dto/pagination.dto';
import { verifyBeforeCreateUserInput } from './dto/verifyBeforeCreateUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { FindAllOutput } from './dto/findAllUser.dto';
import { LogInInput, LogInOutput } from './dto/logInUser.dto';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => LogInOutput)
  @AtLeastOneArgsOf<UserEntity>(['nickname', 'phoneNumber'])
  logInUser(@Args('input') input: LogInInput) {
    return this.userService.logIn(input);
  }

  @Query(() => Boolean)
  @AtLeastOneArgsOf<UserEntity>(['oauth', 'password'])
  @CheckData(UserEntity, CheckDataGuardType.shouldNotExist, 'phoneNumber')
  verifyBeforeCreateUser(
    @GeoInfo() geoInfo: TGeoInfo,
    @Args('input') input: verifyBeforeCreateUserInput,
  ) {
    // ! oauth,password -> optional ( one of two is required )
    // ! phoneNumber: required
    return this.userService.verifyBeforeCreateUser(geoInfo, input);
  }

  @Mutation(() => UserEntity)
  verifyAfterCreateUser(@Args('verifyCode') verifyCode: number) {
    return this.userService.verifyAfterCreateUser(verifyCode);
  }

  @Query(() => FindAllOutput)
  @UseInterceptors(PaginationOutputInterceptor)
  findAllUser(@Args('input') input: PaginationInput) {
    return this.userService.findAllUser(input);
  }

  @Query(() => UserEntity)
  findOneUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneUser(id);
  }

  @Mutation(() => UserEntity)
  @CheckData(UserEntity, CheckDataGuardType.shouldExist)
  updateUser(@Args('input') { id, ...input }: UpdateUserInput) {
    return this.userService.updateUser(id, input);
  }

  @Mutation(() => UserEntity)
  @CheckData(UserEntity, CheckDataGuardType.shouldExist)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.removeUser(id);
  }

  @Mutation(() => UserEntity)
  @CheckData(UserEntity, CheckDataGuardType.shouldExist)
  restoreUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.restoreUser(id);
  }
}
