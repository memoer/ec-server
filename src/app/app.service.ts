import { Injectable } from '@nestjs/common';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import exception from '../_lib/exception';
import { GqlCtx } from '~/@graphql/graphql.interface';

@Injectable()
export class AppService {
  getGeo(req: GqlCtx['req']) {
    // ! request-ip 를 설치해야 req.clientIp 가 intellisense 적용이 된다.
    const clientIp = req.clientIp || requestIp.getClientIp(req);
    if (!clientIp) {
      throw exception({
        type: 'NotFoundException',
        name: 'AppResolver/getGeo',
        msg: 'no ClientIp',
      });
    }
    const geo = geoIp.lookup(clientIp);
    if (!geo) {
      throw exception({
        type: 'NotFoundException',
        name: 'AppResolver/getGeo',
        msg: 'no Geo',
      });
    }
    return geo;
  }
}
