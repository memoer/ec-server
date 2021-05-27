import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne } from 'typeorm';
import { exception, compareHash, generateHash } from '~/_lib';
import { Core } from '~/@database/entity';
import UserInfo from './user.info.entity';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(UserGender, { name: 'UserGender' });

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

  @Column({ nullable: true, unique: true })
  @Field(() => String)
  @Length(8, 16)
  phoneNumber!: string;

  // * optional

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
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @Column({ type: 'enum', enum: UserGender, nullable: true })
  @Field(() => UserGender, { nullable: true })
  @IsEnum(UserGender)
  gender?: UserGender;

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
        msg: 'no this.password',
      });
    }
    return compareHash(plainPassword, this.password);
  }
}
