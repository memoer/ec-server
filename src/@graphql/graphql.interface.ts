import { Request, Response } from 'express';

export interface GqlCtx {
  req: Request;
  res: Response;
}
