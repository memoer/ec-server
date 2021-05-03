import {
  InputType,
  PartialType,
  OmitType,
  PickType,
  IntersectionType,
} from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';
import { verifyBeforeCreateUserInput } from './verifyBeforeCreateUser.dto';

@InputType()
export class UpdateUserInput extends IntersectionType(
  OmitType(PartialType(verifyBeforeCreateUserInput), ['oauth', 'country']),
  PickType(User, ['id', 'nickname', 'email']),
  InputType,
) {}
