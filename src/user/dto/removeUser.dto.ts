import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UserInfo } from '~/@database/entities/user.info.entity';

@InputType()
export class RemoveUserInput extends PartialType(
  PickType(UserInfo, ['reason']),
  InputType,
) {}
