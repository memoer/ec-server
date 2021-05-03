import { InputType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class verifyBeforeCreateUserInput extends PickType(
  User,
  ['phoneNumber', 'password', 'oauth', 'country'],
  InputType,
) {}
