import { Field, ObjectType } from '@nestjs/graphql';
import { UserProvider } from '~/user/entity';

@ObjectType()
export class CallbackOutputData {
  @Field(() => String)
  id!: string;

  @Field(() => UserProvider)
  provider!: Lowercase<Exclude<UserProvider, 'LOCAL'>>;
}

@ObjectType()
export class CallbackOutput {
  @Field(() => CallbackOutputData)
  data!: CallbackOutputData;
}
