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

// ? sex, birthDate, locale -> 클라이언트에서 넘겨야할 값들
// ? nickname, thumbnail, email, oauthId, locale -> auth 회원가입 시, 넘길 수 있는 값들
@InputType()
export class CreateUserInput extends IntersectionType(
  PickType(User, ['sex', 'birthDate', 'nickname', 'thumbnail', 'email']),
  PickType(UserInfo, ['oauthId', 'locale']),
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
