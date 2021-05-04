import { InputType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class UpdateUserInput extends PickType(
  User,
  ['nickname', 'sex', 'birthDate', 'thumbnail', 'password'],
  InputType,
) {}
