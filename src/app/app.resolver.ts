import { UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload } from 'apollo-server-express';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { GqlFileInterceptor } from '~/_lib';
import { AppService } from './app.service';
import { GetGeoOutput } from './dto';
import { UploadedFiles } from '~/_lib/decorator/uploaded-files.decorator';
import { FileUpload } from '~/_lib/dto/fileUpload.dto';

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

  @Mutation(() => Boolean)
  @UseInterceptors(GqlFileInterceptor('user', ['file']))
  uploadFile(
    @UploadedFiles() files: Record<string, string[]>,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): boolean {
    file;
    console.log(files);
    return true;
  }
}
