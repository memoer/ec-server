import { ObjectType } from '@nestjs/graphql';
import { UserEntity } from '~/@database/entities/user.entity';
import { PaginationOuput } from '~/util/dto/pagination.dto';

@ObjectType()
export class FindAllOutput extends PaginationOuput(UserEntity) {}
