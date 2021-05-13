import { Request, Response } from 'express';
import { User, UserInfo } from '~/user/entity';

interface Res extends Response {
  locals: {
    uploadedFiles: Record<string, string[]>;
  };
}
export type ReqUesr = User & UserInfo;
export interface GqlCtx {
  req: Request & { user: ReqUesr };
  res: Res;
}
