import { Ip } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { AppService } from './app.service';
import { GetGeoOutput } from './dto';

@Resolver()
export class AppResolver {
  constructor(private readonly _appService: AppService) {}
  @Query(() => String)
  async hello() {
    return 'hello';
  }

  @Query(() => GetGeoOutput)
  getGeo(@Ip() ip: string, @Context() { req }: GqlCtx) {
    console.log(ip);
    return this._appService.getGeo(req);
  }
}
