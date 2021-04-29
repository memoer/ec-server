import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// isAbstract 속성은 이 클래스에 대해 SDL(Schema Definition Language statements)이 생성되지 않아야 함을 나타낸다.
@ObjectType({ isAbstract: true })
export abstract class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id!: number;

  @CreateDateColumn()
  @Field(() => Date)
  @IsDate()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  @IsDate()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date)
  @IsDate()
  @IsOptional()
  deletedAt?: Date;
}
