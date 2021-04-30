import {
  InputType,
  PartialType,
  OmitType,
  PickType,
  IntersectionType,
} from '@nestjs/graphql';
import { UserEntity } from '~/@database/entities/user.entity';
import { verifyBeforeCreateUserInput } from './verifyBeforeCreateUser.dto';

@InputType()
export class UpdateUserInput extends IntersectionType(
  OmitType(PartialType(verifyBeforeCreateUserInput), ['oauth', 'country']),
  PickType(UserEntity, ['id', 'nickname', 'email']),
  InputType,
) {}
