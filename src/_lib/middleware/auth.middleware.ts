import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { User } from '~/@database/entities/user.entity';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { JwtService } from '~/jwt/jwt.service';
import { UserService } from '~/user/user.service';
import exception from '../exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
  ) {}
  async use(req: GqlCtx['req'], _: GqlCtx['res'], next: NextFunction) {
    if (req.headers['authorization']) {
      const [type, token] = req.headers['authorization'].split(' ');
      if (type !== 'Bearer') {
        throw exception({
          type: 'NotImplementedException',
          name: 'AuthMiddleware/use',
          msg: 'authorization header type invalid',
        });
      }
      try {
        const decoded = this._jwtService.verify(token);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this._userService.getUserById(decoded['id']);
          if (user) req.user = (user as unknown) as User;
        }
      } catch (error) {
        if (error.message === 'invalid signature') {
          throw exception({
            type: 'ForbiddenException',
            name: 'AuthMiddleware',
            msg: 'token invalid',
          });
        }
        throw new InternalServerErrorException(error);
      }
    }
    next();
  }
}
