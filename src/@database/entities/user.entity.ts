import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import generateHash from '~/_lib/generateHash';
import { upperCaseMiddleware } from '~/_lib/middleware/graphql.middleware';
import { CoreEntity } from './core.entity';

export enum UserOAuth {
  GOOGLE = 'GOOGLE',
  NAVER = 'NAVER',
}
registerEnumType(UserOAuth, { name: 'UserOAuth' });

export enum UserRole {
  CLIENT = 'CLIENT',
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

@Entity()
@ObjectType()
export class UserEntity extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  nickname!: string;

  @Column()
  @Field(() => String)
  @IsPhoneNumber()
  phoneNumber!: string;

  @Column()
  @Field(() => String, { middleware: [upperCaseMiddleware] })
  @Max(3)
  country!: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus })
  @Field(() => UserStatus)
  @IsEnum(UserStatus)
  status!: UserStatus;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Column({ select: false, nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Column({ type: 'enum', enum: UserOAuth, nullable: true })
  @Field(() => UserOAuth, { nullable: true })
  @IsEnum(UserOAuth)
  @IsOptional()
  oauth?: UserOAuth;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // before insert/update using repository/manager save.
    if (this.password) {
      this.password = await generateHash(this.password);
    }
  }
}
