import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@InputType()
export class UpdatePhoneOrEmailUserInput extends PartialType(
  PickType(User, ['phoneNumber', 'email']),
  InputType,
) {}
