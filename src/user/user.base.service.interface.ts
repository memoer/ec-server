import {
  UserOAuth,
  UserStatus,
  UserRole,
} from '~/@database/entities/user.entity';

export interface NewUser {
  nickname: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  password?: string | undefined;
  oauth?: UserOAuth | undefined;
}

export interface SetVerifyCodeToRedis {
  args: {
    code: number;
    data: NewUser;
  };
}
export interface SendVerifyCode {
  args: {
    code: number;
    PhoneNumber: string;
  };
}
