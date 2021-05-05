import { InputType, IntersectionType, PickType } from '@nestjs/graphql';
import { UserInfo } from '~/@database/entities/user.info.entity';
import { CreateUserInput } from './createUser.dto';

@InputType()
export class RestoreUserInput extends IntersectionType(
  PickType(UserInfo, ['reason']),
  PickType(CreateUserInput, ['email', 'password']),
  InputType,
) {}
