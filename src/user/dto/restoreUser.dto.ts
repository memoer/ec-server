import { InputType, IntersectionType, PickType } from '@nestjs/graphql';
import { UserInfo } from '~/user/entity';
import { LogInUserInput } from './logInUser.dto';

@InputType()
export class RestoreUserInput extends IntersectionType(
  PickType(UserInfo, ['reason']),
  LogInUserInput,
  InputType,
) {}
