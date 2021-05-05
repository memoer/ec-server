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
import { UserService } from './user.service';
import { CreateUserInput, CreateUserOutput } from './dto/createUser.dto';
import { UpdateUserInput } from './dto/updateUser.dto';
import { FindAllUserOutput } from './dto/findAllUser.dto';
import { LogInUserInput } from './dto/logInUser.dto';
import { RemoveUserInput } from './dto/removeUser.dto';
import { RestoreUserInput } from './dto/restoreUser.dto';
import { CheckVerifyCodeUserInput } from './dto/checkVerfiyCodeUser.dto';
import { SendVerifyCodeUserInput } from './dto/sendVerifyCodeUser.dto';
import { FindOneUserInput } from './dto/findOneUser.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @authGuard()
  me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => String)
  @atLeastOneArgsOfGuard<User>(['nickname', 'email'])
  logInUser(@Args('input') input: LogInUserInput) {
    return this.userService.logInUser(input);
  }

  @Mutation(() => Boolean)
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
  @checkDataGuard(User, CheckDataGuardType.shouldNotExist, 'email')
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Query(() => FindAllUserOutput)
  @UseInterceptors(PaginationOutputInterceptor)
  findAllUser(@Args('input') input: PaginationInput) {
    return this.userService.findAllUser(input);
  }

  @Query(() => User)
  @atLeastOneArgsOfGuard<User>(['id', 'nickname', 'email'])
  findOneUser(@Args('input') input: FindOneUserInput) {
    return this.userService.findOneUser(input);
  }

  @Mutation(() => User)
  @authGuard()
  updateUser(@CurrentUser() user: User, @Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(user, input);
  }

  @Mutation(() => Boolean)
  @authGuard()
  removeUser(@CurrentUser() user: User, @Args('input') input: RemoveUserInput) {
    return this.userService.removeUser(user, input);
  }

  @Mutation(() => Boolean)
  restoreUser(@Args('input') input: RestoreUserInput) {
    return this.userService.restoreUser(input);
  }
}
