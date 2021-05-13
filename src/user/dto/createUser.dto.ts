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
@InputType()
export class CreateUserInput extends IntersectionType(
  PickType(User, ['phoneNumber', 'sex', 'birthDate']),
  PickType(UserInfo, ['country']),
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
