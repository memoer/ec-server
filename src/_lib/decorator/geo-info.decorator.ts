import { createParamDecorator, BadRequestException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import exceptionTemplate from '../exceptionTemplate';
import isEnv from '../isEnv';

export type TGeoInfo = geoIp.Lookup;

export const GeoInfo = createParamDecorator(
  async (_, context: ExecutionContextHost) => {
    if (isEnv('local') || isEnv('dev')) return { country: 'kr' };
    const { req } = GqlExecutionContext.create(context).getContext() as {
      req: Request;
    };
    // 2개 중 하나 되는 것으로 진행하기
    const a_ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];
    const b_ip = req.clientIp || requestIp.getClientIp(req);
    if (isEnv('prod')) console.log(a_ip, b_ip);
    if (!b_ip) {
      throw new BadRequestException(
        exceptionTemplate({ area: 'Decorator', name: 'GeoInfo', msg: 'no ip' }),
      );
    }
    const geoInfo = geoIp.lookup(b_ip);
    if (!geoInfo) {
      throw new BadRequestException(
        exceptionTemplate({
          area: 'Decorator',
          name: 'GeoInfo',
          msg: 'no geo info',
        }),
      );
    }
    return geoInfo;
  },
);
