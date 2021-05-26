import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { ReqUesr } from '~/@graphql/graphql.interface';
import {
  authGuardFn,
  LoggedInUser,
  atLeastOneArgsOfGuardFn,
  checkDataGuardFn,
  CheckDataGuardType,
  PaginationOutputInterceptor,
  GqlFileInterceptor,
  UploadedFilesInput,
  UploadedFiles,
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
import { User } from './entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @authGuardFn()
  me(@LoggedInUser() user: ReqUesr) {
    return user;
  }

  @Query(() => String)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'nickname'])
  async logInUser(@Args('input') input: LogInUserInput) {
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
  @checkDataGuardFn(User, CheckDataGuardType.shouldNotExist, 'nickname')
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
  @UseInterceptors(GqlFileInterceptor('user', ['thumbnail']))
  updateUser(
    @LoggedInUser() user: User,
    @Args('input') input: UpdateUserInput,
    @UploadedFiles() files: UploadedFilesInput<'thumbnail'>,
  ) {
    return this.userService.updateUser(user, input, files);
  }

  @Mutation(() => Boolean)
  @authGuardFn()
  removeUser(
    @LoggedInUser() user: User,
    @Args('input') input: RemoveUserInput,
  ) {
    return this.userService.removeUser(user, input);
  }

  @Mutation(() => Boolean)
  @atLeastOneArgsOfGuardFn<User>(['phoneNumber', 'nickname'])
  restoreUser(@Args('input') input: RestoreUserInput) {
    return this.userService.restoreUser(input);
  }
}
