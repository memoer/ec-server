import {
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';
import { UserInfo } from '~/@database/entities/user.info.entity';

@InputType()
export class RestoreUserInput extends IntersectionType(
  PickType(User, ['id']),
  PartialType(PickType(UserInfo, ['reason'])),
  InputType,
) {}
