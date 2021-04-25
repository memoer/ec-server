import { Type } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DEFAULT_VALUE } from '../../lib/constants';

export function PaginationOuput<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class U {
    @Field(() => [classRef], { nullable: true })
    @ValidateNested()
    data!: T[];

    @Field(() => Int)
    @IsNumber()
    curPage!: number;

    @Field(() => Int)
    @IsNumber()
    totalPage!: number;

    @Field(() => Boolean)
    @IsBoolean()
    hasNextPage!: boolean;
  }
  return U;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_VALUE.PAGE_NUMBER })
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_VALUE.TAKE })
  @IsNumber()
  @IsOptional()
  take?: number;
}
