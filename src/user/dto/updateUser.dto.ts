import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';
import { CreateUserInput } from './createUser.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  IntersectionType(
    PickType(CreateUserInput, ['email', 'sex', 'birthDate', 'password']),
    PickType(User, ['nickname', 'thumbnail']),
  ),
  InputType,
) {}
