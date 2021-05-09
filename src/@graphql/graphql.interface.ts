import { Request, Response } from 'express';
import { User, UserInfo } from '~/user/entity';

export type ReqUesr = User & UserInfo;
export interface GqlCtx {
  req: Request & { user: ReqUesr };
  res: Response;
}
