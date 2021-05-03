import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class LogInInput extends PickType(
  User,
  ['nickname', 'phoneNumber', 'password'],
  InputType,
) {}

@ObjectType()
export class LogInOutput {
  @Field(() => String)
  @IsString()
  accessToken!: string;
}
