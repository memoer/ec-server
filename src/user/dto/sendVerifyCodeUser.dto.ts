import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '~/user/entity';

@InputType()
export class SendVerifyCodeUserInput extends PartialType(
  PickType(User, ['email', 'phoneNumber']),
  InputType,
) {}
