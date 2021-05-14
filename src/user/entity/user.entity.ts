import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { exception, compareHash, generateHash } from '~/_lib';
import { Core } from '~/@database/entity';
import UserInfo from './user.info.entity';

export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(UserSex, { name: 'UserSex' });

export enum UserRelation {
  info = 'info',
}
// ! 유저 기본 정보
// ! 유저가 직접적으로 확인 / 볼 수 있는 정보들임
// ! 유저가 스스로 수정할 수 있는 정보들
@Entity()
@ObjectType()
export default class User extends Core {
  // * required
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @Length(1, 128)
  nickname!: string;

  // * optional
  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  @IsPhoneNumber()
  phoneNumber?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ nullable: true })
  @Field(() => Date)
  @IsDate()
  birthDate?: Date;

  @Column({ type: 'enum', enum: UserSex, nullable: true })
  @Field(() => UserSex, { nullable: true })
  @IsEnum(UserSex)
  sex?: UserSex;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user)
  [UserRelation.info]!: UserInfo;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // subscription은 `save` 사용할때만 호출된다.
    // 정확하게는 `create` 로 만들어진 entitiy를 통해 `save`를 할 때
    // before insert/update using repository/manager save.
    if (this.password) {
      this.password = await generateHash(this.password);
    }
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!this.password) {
      throw exception({
        type: 'NotFoundException',
        loc: 'User.verifyPassword',
        msg: 'this.password is not found',
      });
    }
    return compareHash(plainPassword, this.password);
  }
}
