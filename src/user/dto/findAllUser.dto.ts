import {
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/user/entity';
import { PaginationInputBySkip, PaginationOutput } from '~/_lib';

@ObjectType()
export class FindAllUserOutput extends PaginationOutput(User) {}

@InputType()
export class FindAllUserInput extends IntersectionType(
  PaginationInputBySkip,
  PartialType(PickType(User, ['email', 'nickname', 'sex'])),
  InputType,
) {}
