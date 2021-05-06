import { Request, Response } from 'express';
import { User } from '~/@database/entities/user.entity';
import { UserInfo } from '~/@database/entities/user.info.entity';
export type ReqUesr = User & UserInfo;
export interface GqlCtx {
  req: Request & { user: ReqUesr };
  res: Response;
}
