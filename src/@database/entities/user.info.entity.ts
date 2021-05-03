import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class UserInfo {
  @PrimaryColumn()
  @Field(() => Int)
  userId!: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  @Field(() => User)
  @ValidateNested()
  user!: User;

  @Column()
  @Field(() => String, { nullable: true, description: '회원탈퇴/복구 이유' })
  @IsString()
  @IsOptional()
  reason?: string;
}
