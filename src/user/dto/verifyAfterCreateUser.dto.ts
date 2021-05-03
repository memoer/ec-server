import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';

@ObjectType()
export class VerifyAfterCreateUserOutput {
  @Field(() => User)
  data!: User;

  @Field(() => String)
  token!: string;
}
