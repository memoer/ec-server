import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CheckVerifyCodeUserInput {
  @Field(() => String)
  @IsString()
  key!: string;

  @Field(() => String)
  @IsString()
  verifyCode!: string;
}
