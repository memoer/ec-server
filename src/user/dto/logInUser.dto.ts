import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class LogInUserInput extends PartialType(
  PickType(User, ['nickname', 'email']),
  InputType,
) {
  @Field(() => String)
  @IsString()
  password!: string;
}
