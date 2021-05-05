import { Resolver, Query, Context } from '@nestjs/graphql';
import { GqlCtx } from '../@graphql/graphql.interface';
import { AppService } from './app.service';
import { GetGeoOutput } from './dto/getGeo.dto';

@Resolver()
export class AppResolver {
  constructor(private readonly _appService: AppService) {}
  @Query(() => String)
  async hello() {
    return 'hello';
  }

  @Query(() => GetGeoOutput)
  getGeo(@Context() { req }: GqlCtx) {
    return this._appService.getGeo(req);
  }
}
