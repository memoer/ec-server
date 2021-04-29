import { InputType, PickType } from '@nestjs/graphql';
import { UserEntity } from '~/@database/entities/user.entity';

@InputType()
export class verifyBeforeCreateUserInput extends PickType(
  UserEntity,
  ['phoneNumber', 'password', 'oauth'],
  InputType,
) {}
