import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/user/entity';
import { FileUploadInput, GraphQLUpload } from '~/_lib';
import { CreateUserInput } from './createUser.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  IntersectionType(
    PickType(CreateUserInput, ['sex', 'birthDate', 'password']),
    PickType(User, ['nickname', 'email', 'phoneNumber']),
  ),
  InputType,
) {
  @Field(() => GraphQLUpload, { nullable: true })
  thumbnail?: FileUploadInput;
}
