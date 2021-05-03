import { ObjectType } from '@nestjs/graphql';
import { User } from '~/@database/entities/user.entity';
import { PaginationOuput } from '~/util/dto/pagination.dto';

@ObjectType()
export class FindAllOutput extends PaginationOuput(User) {}
