import { Request, Response } from 'express';
import { User } from '~/@database/entities/user.entity';

export type ReqUser = User;
export interface GqlCtx {
  req: Request & { user: ReqUser };
  res: Response;
}
