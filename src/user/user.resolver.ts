import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { User } from '~/@database/entities/user.entity';
import { PaginationOutputInterceptor } from '~/_lib/interceptor/pagination-output.interceptor';
import {
  checkDataGuard,
  CheckDataGuardType,
} from '~/_lib/guard/check-data.guard';
import { atLeastOneArgsOfGuard } from '~/_lib/guard/at-least-one-args-of.guard';
import { PaginationInput } from '~/util/dto/pagination.dto';
import { authGuard } from '~/_lib/guard/auth.guard';
import { CurrentUser } from '~/_lib/decorator/current-user.decorator';
import { ReqUser } from '~/@graphql/graphql.interface';
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dto/createUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { FindAllUserOutput } from './dto/findAllUser.dto';
import { LogInUserInput, LogInUserOutput } from './dto/logInUser.dto';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';
import { CheckVerifyCodeUserInput } from './dto/checkVerfiyCodeUser.dto';
import { SendVerifyCodeUserInput } from './dto/sendVerifyCodeUser.dto';
import { FindOneUserInput } from './dto/findOneUser.dto';
import { UpdatePhoneOrEmailUserInput } from './dto/updatePhoneOrEmailUser.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @authGuard()
  me(@CurrentUser() user: ReqUser) {
    return user;
  }

  @Query(() => LogInUserOutput)
  @atLeastOneArgsOfGuard<User>(['nickname', 'phoneNumber'])
  logInUser(@Args('input') input: LogInUserInput) {
    return this.userService.logInUser(input);
  }

  @Mutation(() => Boolean)
  @atLeastOneArgsOfGuard<User>(['phoneNumber', 'email'])
  sendVerifyCode(@Args('input') input: SendVerifyCodeUserInput) {
    // ! oauth,password -> optional ( one of two is required )
    // ! phoneNumber: required
    return this.userService.sendVerifyCodeUser(input);
  }

  @Mutation(() => Boolean)
  checkVerifyCode(@Args('input') input: CheckVerifyCodeUserInput) {
    return this.userService.checkVerifyCodeUser(input);
  }

  @Mutation(() => CreateUserOutput)
  @checkDataGuard(User, CheckDataGuardType.shouldNotExist, 'phoneNumber')
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Query(() => FindAllUserOutput)
  @UseInterceptors(PaginationOutputInterceptor)
  findAllUser(@Args('input') input: PaginationInput) {
    return this.userService.findAllUser(input);
  }

  @Query(() => User)
  @atLeastOneArgsOfGuard<User>(['id', 'phoneNumber', 'nickname', 'email'])
  findOneUser(@Args('input') input: FindOneUserInput) {
    return this.userService.findOneUser(input);
  }

  @Mutation(() => User)
  @authGuard()
  updateUser(@CurrentUser() user: User, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(user.id, input);
  }

  @Mutation(() => User)
  @authGuard()
  @atLeastOneArgsOfGuard<User>(['phoneNumber', 'email'])
  updatePhoneOrEmailUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdatePhoneOrEmailUserInput,
  ) {
    return this.userService.updatePhoneOrEmailUser(user.id, input);
  }

  @Mutation(() => User)
  @authGuard()
  removeUser(
    @CurrentUser() user: ReqUser,
    @Args('input') input: RemoveUserInput,
  ) {
    return this.userService.removeUser(user, input);
  }

  @Mutation(() => User)
  @authGuard()
  restoreUser(
    @CurrentUser() user: ReqUser,
    @Args('id') input: RestoreUserInput,
  ) {
    return this.userService.restoreUser(user, input);
  }
}
