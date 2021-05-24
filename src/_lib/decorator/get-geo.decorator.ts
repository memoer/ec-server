import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import { GqlCtx } from '~/@graphql/graphql.interface';
import exception from '../exception';
import isEnv from '../isEnv';
export interface IGetGeo {
  country: string;
}

export const GetGeo = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const { req } = GqlExecutionContext.create(context).getContext() as GqlCtx;
    const clientIp = req.clientIp || requestIp.getClientIp(req);
    if (!clientIp) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AppResolver.getGeo',
        msg: 'no clientIp',
      });
    }
    console.log(clientIp);
    const geo = geoIp.lookup(clientIp);
    if (isEnv('local')) return { country: 'KR' };
    if (!geo) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AppResolver.getGeo',
        msg: 'no geo',
      });
    }
    return geo;
  },
);
