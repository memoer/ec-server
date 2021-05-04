import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { UserInfo } from '~/@database/entities/user.info.entity';

@InputType()
export class RestoreUserInput extends PartialType(
  PickType(UserInfo, ['reason']),
  InputType,
) {}
