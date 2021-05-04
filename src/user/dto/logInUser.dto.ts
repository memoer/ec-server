import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class LogInUserInput extends PickType(
  User,
  ['nickname', 'phoneNumber'],
  InputType,
) {
  @Field(() => String)
  @IsString()
  password!: string;
}

@ObjectType()
export class LogInUserOutput {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  data!: User;
}
