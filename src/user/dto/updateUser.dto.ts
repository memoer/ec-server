import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/user/entity';
import { CreateUserInput } from './createUser.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  IntersectionType(
    PickType(CreateUserInput, ['sex', 'birthDate', 'password']),
    PickType(User, ['nickname', 'thumbnail', 'email', 'phoneNumber']),
  ),
  InputType,
) {}
