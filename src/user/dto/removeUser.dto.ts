import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UserInfo } from '~/user/entity';

@InputType()
export class RemoveUserInput extends PartialType(
  PickType(UserInfo, ['reason']),
  InputType,
) {}
