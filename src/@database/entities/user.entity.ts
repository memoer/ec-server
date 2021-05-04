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
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import exception from '~/_lib/exception';
import { compareHash, generateHash } from '~/_lib/hash';
import { Core } from './core.entity';
import { UserInfo } from './user.info.entity';

export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
registerEnumType(UserSex, { name: 'UserSex' });

// ! 유저 기본 정보
// ! 유저가 직접적으로 확인 / 볼 수 있는 정보들임
// ! 유저가 스스로 수정할 수 있는 정보들
@Entity()
@ObjectType()
export class User extends Core {
  // * required
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  @Length(4, 128)
  nickname!: string;

  @Column({ unique: true })
  @Field(() => String)
  @IsPhoneNumber()
  phoneNumber!: string;

  @Column({ type: 'enum', enum: UserSex })
  @Field(() => UserSex)
  @IsEnum(UserSex)
  sex!: UserSex;

  @Column()
  @Field(() => Date)
  @IsDate()
  birthDate!: Date;
  // * optional
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Column({ nullable: true, unique: true })
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.nickname, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  info!: UserInfo;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // before insert/update using repository/manager save.
    if (this.password) {
      this.password = await generateHash(this.password);
    }
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    if (!this.password) {
      throw exception({
        type: 'NotFoundException',
        name: 'User/verifyPassword',
        msg: 'this.password is not found',
      });
    }
    return compareHash(plainPassword, this.password);
  }
}
