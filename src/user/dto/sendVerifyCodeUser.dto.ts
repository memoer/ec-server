import { InputType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class SendVerifyCodeUserInput extends PickType(
  User,
  ['email'],
  InputType,
) {}
