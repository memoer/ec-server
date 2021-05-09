import {
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '~/user/entity';
import {
  PaginationInputBySkip,
  PaginationOuput,
} from '~/util/dto/pagination.dto';

@ObjectType()
export class FindAllUserOutput extends PaginationOuput(User) {}

@InputType()
export class FindAllUserInput extends IntersectionType(
  PaginationInputBySkip,
  PartialType(PickType(User, ['email', 'nickname', 'sex'])),
  InputType,
) {}
