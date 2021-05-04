import {
  UserOAuth,
  UserStatus,
  UserRole,
} from '~/@database/entities/user.info.entity';

export interface NewUser {
  nickname: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  password?: string | undefined;
  oauth?: UserOAuth | undefined;
}

export interface SendCodeNSetToRedis {
  phoneNumber: string;
  newUser: NewUser;
}
export interface RemoveOrRestore {
  type: 'remove' | 'restore';
  userId: number;
  nickname: string;
  reason?: string;
}
