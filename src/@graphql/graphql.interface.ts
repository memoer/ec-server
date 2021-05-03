import { Request, Response } from 'express';
import { User } from '~/@database/entities/user.entity';

export interface GqlCtx {
  req: Request & { user: User };
  res: Response;
}
