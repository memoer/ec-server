import { UserProvider, UserStatus, UserRole } from './entity';

export interface NewUser {
  nickname: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber: string;
  password?: string | undefined;
  oauth?: UserProvider | undefined;
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
