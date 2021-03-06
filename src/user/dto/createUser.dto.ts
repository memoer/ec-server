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

// ? phoneNumber, gender, birthDate -> 클라이언트에서 넘겨야할 값들
// ? oauthId -> auth 회원가입 시, 넘기는 값
@InputType()
export class CreateUserInput extends IntersectionType(
  PickType(User, ['phoneNumber', 'gender', 'birthDate', 'email']),
  PickType(UserInfo, ['oauthId', 'provider']),
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
