import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// isAbstract 속성은 이 클래스에 대해 SDL(Schema Definition Language statements)이 생성되지 않아야 함을 나타낸다.
@ObjectType({ isAbstract: true })
export abstract class Core {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
