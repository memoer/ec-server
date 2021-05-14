import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';
import { User, UserInfo } from '~/user/entity';
import { passwordRegex } from '~/_lib';

// ? sex, birthDate -> to be served data from client
// ? nickname, thumbnail -> for oauth
@InputType()
export class CreateUserInput extends IntersectionType(
  PickType(User, ['sex', 'nickname', 'birthDate', 'thumbnail']),
  PickType(UserInfo, ['oauthId']),
  InputType,
) {
  @Field(() => String)
  @IsString()
  @Length(4, 32)
  @Matches(passwordRegex, { message: 'password too weak' })
  password!: string;
}

@ObjectType()
export class CreateUserOutput {
  @Field(() => User)
  data!: User;

  @Field(() => String)
  token!: string;
}
