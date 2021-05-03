import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction } from 'express';
import { Repository } from 'typeorm';
import { User } from '~/@database/entities/user.entity';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { JwtService } from '~/jwt/jwt.service';
import exception from '../exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(User)
    protected readonly _user: Repository<User>,
  ) {}
  async use(req: GqlCtx['req'], _: GqlCtx['res'], next: NextFunction) {
    if (req.headers['authorization']) {
      const decoded = this._jwtService.verify(
        req.headers['authorization'].toString(),
      );
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const user = await this._user.findOne(decoded['id']);
        if (!user) {
          throw exception({
            type: 'NotFoundException',
            name: 'AuthMiddleware',
            msg: `user of ${decoded['id']} not found`,
          });
        }
        req.user = user;
      }
    }
    next();
  }
}
