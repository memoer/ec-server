import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { User } from '~/user/entity';
import { PaginationOutputInterceptor } from '~/_lib/interceptor/pagination-output.interceptor';
import {
  checkDataGuardFn,
  CheckDataGuardType,
} from '~/_lib/guard/check-data.guard';
import { atLeastOneArgsOfGuardFn } from '~/_lib/guard/at-least-one-args-of.guard';
import { authGuardFn } from '~/_lib/guard/auth.guard';
import { CurrentUser } from '~/_lib/decorator/current-user.decorator';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dto/createUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { FindAllUserInput, FindAllUserOutput } from './dto/findAllUser.dto';
import { LogInUserInput } from './dto/logInUser.dto';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';
import { CheckVerifyCodeUserInput } from './dto/checkVerfiyCodeUser.dto';
import { SendVerifyCodeUserInput } from './dto/sendVerifyCodeUser.dto';
import { FindOneUserInput } from './dto/findOneUser.dto';
import { ReqUesr } from '~/@graphql/graphql.interface';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @authGuardFn()
  me(@CurrentUser() user: ReqUesr) {
    return user;
  }

  @Query(() => String)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'nickname'])
  logInUser(@Args('input') input: LogInUserInput) {
    return this.userService.logInUser(input);
  }

  @Mutation(() => Boolean)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'email'])
  sendVerifyCodeUser(@Args('input') input: SendVerifyCodeUserInput) {
    return this.userService.sendVerifyCodeUser(input);
  }

  @Mutation(() => Boolean)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'email'])
  checkVerifyCodeUser(@Args('input') input: CheckVerifyCodeUserInput) {
    return this.userService.checkVerifyCodeUser(input);
  }

  @Mutation(() => CreateUserOutput)
  @checkDataGuardFn(User, CheckDataGuardType.shouldNotExist, 'phoneNumber')
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Query(() => FindAllUserOutput)
  @UseInterceptors(PaginationOutputInterceptor)
  findAllUser(@Args('input') input: FindAllUserInput) {
    return this.userService.findAllUser(input);
  }

  @Query(() => User)
  @atLeastOneArgsOfGuardFn<User>(['id', 'phoneNumber', 'nickname'])
  findOneUser(@Args('input') input: FindOneUserInput) {
    return this.userService.findOneUser(input);
  }

  @Mutation(() => User)
  @authGuardFn()
  updateUser(@CurrentUser() user: User, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(user, input);
  }

  @Mutation(() => Boolean)
  @authGuardFn()
  removeUser(@CurrentUser() user: User, @Args('input') input: RemoveUserInput) {
    return this.userService.removeUser(user, input);
  }

  @Mutation(() => Boolean)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'nickname'])
  restoreUser(@Args('input') input: RestoreUserInput) {
    return this.userService.restoreUser(input);
  }
}
