import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserEntity } from '~/@database/entities/user.entity';

@InputType()
export class LogInInput extends PickType(
  UserEntity,
  ['nickname', 'phoneNumber', 'password'],
  InputType,
) {}

@ObjectType()
export class LogInOutput {
  @Field(() => String)
  @IsString()
  accessToken!: string;
}
