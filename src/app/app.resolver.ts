import { Resolver, Query, Context } from '@nestjs/graphql';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import { GqlCtx } from '../@graphql/graphql.interface';
import exception from '../_lib/exception';
import { GetGeoOutput } from './dto/getGeo.dto';

@Resolver()
export class AppResolver {
  @Query(() => String)
  async hello() {
    return 'hello';
  }

  @Query(() => GetGeoOutput)
  getGeo(@Context() { req }: GqlCtx) {
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
