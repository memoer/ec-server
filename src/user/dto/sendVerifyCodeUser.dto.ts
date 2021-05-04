import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class SendVerifyCodeUserInput extends PartialType(
  PickType(User, ['phoneNumber', 'email']),
  InputType,
) {}
