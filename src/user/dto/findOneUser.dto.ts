import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class FindOneUserInput extends PartialType(
  PickType(User, ['nickname', 'email', 'id']),
  InputType,
) {}
