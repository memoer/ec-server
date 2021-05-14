import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UploadedFiles = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const { locals } = GqlExecutionContext.create(context).getContext().res;
    // ? @UploadedFiles() {thumbnail}: Record<'thumbnail', string[]> 의 상태로 변수를 가져올 때,
    // ? uploadedFiles 내부에 아무것도 없으면 error 가 난다 locals = {} -> locals.uploadedFiles.thumbnail Error!
    // ? 이를 방지하기 위해 {} 로 초기화
    if (!locals.uploadedFiles) locals.uploadedFiles = {};
    return locals.uploadedFiles;
  },
);
