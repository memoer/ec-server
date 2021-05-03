import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { User } from '~/@database/entities/user.entity';
import { PaginationOutputInterceptor } from '~/_lib/interceptor/pagination-output.interceptor';
import { CheckData, CheckDataGuardType } from '~/_lib/guard/check-data.guard';
import { AtLeastOneArgsOf } from '~/_lib/guard/at-least-one-args-of.guard';
import { PaginationInput } from '~/util/dto/pagination.dto';
import { UserService } from './user.service';
import { verifyBeforeCreateUserInput } from './dto/verifyBeforeCreateUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { FindAllOutput } from './dto/findAllUser.dto';
import { LogInInput, LogInOutput } from './dto/logInUser.dto';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';
import { VerifyAfterCreateUserOutput } from './dto/verifyAfterCreateUser.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => LogInOutput)
  @AtLeastOneArgsOf<User>(['nickname', 'phoneNumber'])
  logInUser(@Args('input') input: LogInInput) {
    return this.userService.logIn(input);
  }

  @Mutation(() => Boolean)
  @AtLeastOneArgsOf<User>(['oauth', 'password'])
  @CheckData(User, CheckDataGuardType.shouldNotExist, 'phoneNumber')
  verifyBeforeCreateUser(@Args('input') input: verifyBeforeCreateUserInput) {
    // ! oauth,password -> optional ( one of two is required )
    // ! phoneNumber: required
    return this.userService.verifyBeforeCreateUser(input);
  }

  @Mutation(() => VerifyAfterCreateUserOutput)
  verifyAfterCreateUser(@Args('code') code: number) {
    return this.userService.verifyAfterCreateUser(String(code));
  }

  @Query(() => FindAllOutput)
  @UseInterceptors(PaginationOutputInterceptor)
  findAllUser(@Args('input') input: PaginationInput) {
    return this.userService.findAllUser(input);
  }

  @Query(() => User)
  findOneUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOneUser(id);
  }

  @Mutation(() => User)
  @CheckData(User, CheckDataGuardType.shouldExist)
  updateUser(@Args('input') { id, ...input }: UpdateUserInput) {
    return this.userService.updateUser(id, input);
  }

  @Mutation(() => User)
  @CheckData(User, CheckDataGuardType.shouldExist)
  removeUser(@Args('input') input: RemoveUserInput) {
    return this.userService.removeUser(input);
  }

  @Mutation(() => User)
  @CheckData(User, CheckDataGuardType.shouldExist)
  restoreUser(@Args('id') input: RestoreUserInput) {
    return this.userService.restoreUser(input);
  }
}
