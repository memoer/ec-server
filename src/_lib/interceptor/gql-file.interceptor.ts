import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { AwsService } from '~/aws/aws.service';
import { FileUpload } from '../dto/fileUpload.dto';

export function GqlFileInterceptor(
  loc: 'user' | 'post',
  fieldNameList: string[],
) {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private readonly _awsService: AwsService) {}

    async upload(fieldName: string, gqlCtx: GqlExecutionContext) {
      const { uploadedFiles } = gqlCtx.getContext().res.locals;
      const files = await gqlCtx.getArgs()[fieldName];
      return Promise.all(
        (Array.isArray(files) ? files : [files]).map(
          async ({
            mimetype,
            encoding,
            createReadStream,
            filename,
          }: FileUpload) => {
            const result = await this._awsService.uploadToS3({
              ContentType: mimetype,
              ContentEncoding: encoding,
              Body: createReadStream(),
              Key: `${loc}/${new Date().valueOf()}_${filename
                .split('.')
                .slice(0, -1)
                .join('.')}`,
            });
            if (!uploadedFiles[fieldName]) {
              uploadedFiles[fieldName] = [result.Location];
            } else {
              uploadedFiles[fieldName].push(result.Location);
            }
          },
        ),
      );
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>) {
      const gqlCtx = GqlExecutionContext.create(context);
      (<GqlCtx['res']>gqlCtx.getContext().res).locals = {
        uploadedFiles: {},
      };
      await Promise.all(
        fieldNameList.map((fieldName) => this.upload(fieldName, gqlCtx)),
      );
      return next.handle();
    }
  }
  return mixin(MixinInterceptor);
}
