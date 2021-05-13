import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { ReqUesr } from '~/@graphql/graphql.interface';
import { User } from './entity';
import {
  authGuardFn,
  CurrentUser,
  atLeastOneArgsOfGuardFn,
  checkDataGuardFn,
  CheckDataGuardType,
  PaginationOutputInterceptor,
} from '~/_lib';
import {
  CreateUserInput,
  CreateUserOutput,
  UpdateUserInput,
  FindAllUserInput,
  FindAllUserOutput,
  LogInUserInput,
  RemoveUserInput,
  RestoreUserInput,
  CheckVerifyCodeUserInput,
  SendVerifyCodeUserInput,
  FindOneUserInput,
} from './dto';
import { UserService } from './user.service';

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
