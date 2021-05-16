import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '.';

export enum UserRole {
  CLIENT = 'CLIENT',
  CLIENT_ADMIN = 'CLIENT_ADMIN',
  SERVER_ADMIN = 'SERVER_ADMIN',
}
registerEnumType(UserRole, { name: 'UserRole' });

// 한 달 동안 활동이 1번도 없다면 휴면유저
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DORMANCY = 'DORMANY',
}
registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'ACTIVE[활동], DORMANCY[휴면]',
});

export enum UserProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
}
registerEnumType(UserProvider, { name: 'UserProvider' });

export enum UserInfoRelation {
  user = 'user',
}
// ! 유저가 보는 정보들이 아님
// ! 개발자 / DBA 들이 보는 정보들
// ! 유저가 스스로 수정할 수 없는 정보들
@Entity()
@ObjectType()
export default class UserInfo {
  @PrimaryColumn()
  @Field(() => Int)
  @IsNumber()
  userId!: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @Field(() => UserStatus)
  @IsEnum(UserStatus)
  status!: UserStatus;

  @Column()
  @Field(() => UserProvider)
  @IsEnum(UserProvider)
  provider!: UserProvider;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  oauthId?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true, description: '회원탈퇴/복구 이유' })
  @IsString()
  @IsOptional()
  reason?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Length(2)
  @IsOptional()
  locale?: string;

  @OneToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  [UserInfoRelation.user]!: User;
}
