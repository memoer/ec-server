import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '~/user/entity';

@InputType()
export class LogInUserInput extends PartialType(
  PickType(User, ['nickname', 'phoneNumber']),
  InputType,
) {
  @Field(() => String)
  @IsString()
  password!: string;
}
