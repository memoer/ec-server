import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { SendVerifyCodeUserInput } from './sendVerifyCodeUser.dto';

@InputType()
export class CheckVerifyCodeUserInput extends SendVerifyCodeUserInput {
  @Field(() => String)
  @IsString()
  verifyCode!: string;
}
