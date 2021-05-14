import * as nestCommon from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GqlFileInterceptor } from '~/_lib/interceptor/gql-file.interceptor';
import {
  awsServiceMock,
  callHandlerMock,
  contextMock,
  createdGqlCtxMock,
  gqlExecCtxMock,
} from '@/common';
import { TMock } from '@/type';

// const nestMock = {
//   CallHandler: '',
//   ExecutionContext: '',
//   Injectable: '',
//   mixin: '',
//   NestInterceptor: '',
// };

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  mixin: jest.fn(),
}));

describe('GqlFileInterceptor', () => {
  const closure = { loc: 'user', fieldNameList: ['test_1', 'test_2'] };
  let mixinInterceptor: {
    upload: (fieldName: string, ctx: GqlExecutionContext) => Promise<void[]>;
    intercept: (
      context: nestCommon.ExecutionContext,
      next: nestCommon.CallHandler<any>,
    ) => Promise<Observable<any>>;
  };
  it('execute function', () => {
    // ? init variables
    const returnData = {
      mixin: 'success',
    };
    // ? init mock
    const { mixin } = (nestCommon as unknown) as TMock<typeof nestCommon>;
    mixin.mockReturnValue(returnData.mixin);
    // ? run
    const result = GqlFileInterceptor(
      closure.loc as any,
      closure.fieldNameList,
    );
    mixinInterceptor = new mixin.mock.calls[0][0](awsServiceMock);
    // ? test
    expect(mixin).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData.mixin);
  });

  it('mixinInterceptor class, intercept function', async () => {
    // ? init variables
    const returnData = {
      gqlExecCtxMock: {
        getContext: { res: { locals: undefined } },
        getArgs: { input: { [closure.fieldNameList[0]]: 'temp' } },
      },
    };
    // ? init mock
    gqlExecCtxMock.getContext.mockReturnValue(
      returnData.gqlExecCtxMock.getContext,
    );
    gqlExecCtxMock.getArgs.mockReturnValue(returnData.gqlExecCtxMock.getArgs);
    const o = mixinInterceptor.upload;
    mixinInterceptor.upload = jest.fn();
    // ? run
    await mixinInterceptor.intercept(contextMock.context, callHandlerMock);
    // ? test
    expect(gqlExecCtxMock.create).toHaveBeenNthCalledWith(
      1,
      contextMock.context,
    );
    expect(gqlExecCtxMock.getContext).toHaveBeenCalledTimes(1);
    closure.fieldNameList.forEach((fieldName, idx) => {
      expect(mixinInterceptor.upload).toHaveBeenNthCalledWith(
        idx + 1,
        fieldName,
        createdGqlCtxMock,
      );
    });
    expect(callHandlerMock.handle).toHaveBeenCalledTimes(1);
    mixinInterceptor.upload = o;
  });

  it('mixinInterceptor class, upload function', async () => {
    // ? init variables
    const fieldName = closure.fieldNameList[0];
    const returnData = {
      gqlCtx: {
        getContext: {
          res: { locals: { uploadedFiles: {} } },
        },
        getArgs: {
          mimetype: 'mimetype',
          encoding: 'encoding',
          createReadStream: () => 'createReadStream',
          filename: 'filename',
        },
      },
      awsServiceMock: {
        uploadToS3: { Location: 'Location' },
      },
    };
    // ? init mock
    const gqlCtx = {
      getContext: jest.fn().mockReturnValue(returnData.gqlCtx.getContext),
      getArgs: jest.fn().mockReturnValue({
        input: { [fieldName]: returnData.gqlCtx.getArgs },
      }),
    };
    awsServiceMock.uploadToS3.mockResolvedValue(
      returnData.awsServiceMock.uploadToS3,
    );
    // ? run
    await mixinInterceptor.upload(fieldName, gqlCtx as any);
    // ? test
    expect(gqlCtx.getContext).toHaveBeenCalledTimes(1);
    expect(gqlCtx.getArgs).toHaveBeenCalledTimes(1);
    expect(awsServiceMock.uploadToS3).toHaveBeenNthCalledWith(1, {
      ContentType: returnData.gqlCtx.getArgs.mimetype,
      ContentEncoding: returnData.gqlCtx.getArgs.encoding,
      Body: returnData.gqlCtx.getArgs.createReadStream(),
      Key: expect.any(String),
      ACL: 'public-read',
    });
    expect(returnData.gqlCtx.getContext.res.locals.uploadedFiles).toEqual({
      [fieldName]: [returnData.awsServiceMock.uploadToS3.Location],
    });
  });

  it('mixinInterceptor class, upload function', async () => {
    // ? init variables
    const fieldName = closure.fieldNameList[0];
    const returnData = {
      gqlCtx: {
        getContext: {
          res: { locals: { uploadedFiles: { [fieldName]: [] } } },
        },
        getArgs: {
          mimetype: 'mimetype',
          encoding: 'encoding',
          createReadStream: () => 'createReadStream',
          filename: 'filename',
        },
      },
      awsServiceMock: {
        uploadToS3: { Location: 'Location' },
      },
    };
    // ? init mock
    const gqlCtx = {
      getContext: jest.fn().mockReturnValue(returnData.gqlCtx.getContext),
      getArgs: jest.fn().mockReturnValue({
        input: { [fieldName]: returnData.gqlCtx.getArgs },
      }),
    };
    awsServiceMock.uploadToS3.mockResolvedValue(
      returnData.awsServiceMock.uploadToS3,
    );
    // ? run
    await mixinInterceptor.upload(fieldName, gqlCtx as any);
    // ? test
    expect(returnData.gqlCtx.getContext.res.locals.uploadedFiles).toEqual({
      [fieldName]: [returnData.awsServiceMock.uploadToS3.Location],
    });
  });
});
