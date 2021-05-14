import { GraphQLUpload as GQLUpload } from 'apollo-server-express';
import { ReadStream } from 'fs';

// ? undefined 제거용으로 사용 -> GraphQL Field 로 사용해야하는데, `undefined` 때문에 에러가 나옴
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const GraphQLUpload = GQLUpload!;

export interface FileUploadInput {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
}

export type UploadedFilesInput<T extends string> = Record<
  T,
  undefined | string[]
>;
