import { Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import { exception, isEnv } from '~/_lib';
import { GqlCtx } from '~/@graphql/graphql.interface';

@Injectable()
export class AppService {
  getGeo(req: GqlCtx['req']) {
    // ! request-ip 를 설치해야 req.clientIp 가 intellisense 적용이 된다.
    const clientIp = isEnv('local')
      ? '122.46.48.234'
      : req.clientIp || requestIp.getClientIp(req);
    if (!clientIp) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AppResolver.getGeo',
        msg: 'no clientIp',
      });
    }
    const geo = geoIp.lookup(clientIp);
    if (!geo) {
      throw exception({
        type: 'NotFoundException',
        loc: 'AppResolver.getGeo',
        msg: 'no geo',
      });
    }
    return geo;
  }
}
