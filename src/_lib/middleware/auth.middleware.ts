import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User, UserRelation } from '~/user/entity';
import { GqlCtx, ReqUesr } from '~/@graphql/graphql.interface';
import { JwtService } from '~/jwt/jwt.service';
import exception from '../exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly _jwtService: JwtService) {}

  async use(req: GqlCtx['req'], _: GqlCtx['res'], next: NextFunction) {
    if (req.headers['authorization']) {
      const [type, token] = req.headers['authorization'].split(' ');
      if (type !== 'Bearer') {
        throw exception({
          type: 'NotImplementedException',
          loc: 'AuthMiddleware.use',
          msg: 'authorization invalid',
        });
      }
      try {
        const decoded = this._jwtService.verify(token);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await getRepository(User).findOne(decoded['id'], {
            relations: [UserRelation.info],
          });
          if (user) req.user = user as ReqUesr;
        }
      } catch (error) {
        if (error.message === 'invalid signature') {
          throw exception({
            type: 'UnauthorizedException',
            loc: 'AuthMiddleware.me',
            msg: 'token invalid',
          });
        }
        throw new InternalServerErrorException(error);
      }
    }
    next();
  }
}
