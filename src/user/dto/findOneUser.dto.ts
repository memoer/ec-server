import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '~/user/entity';

@InputType()
export class FindOneUserInput extends PartialType(
  PickType(User, ['nickname', 'email', 'id']),
  InputType,
) {}
