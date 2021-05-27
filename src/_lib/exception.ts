import * as Exceptions from '@nestjs/common/exceptions';

export enum ErrorCode {
  invalid = 1,
  conflict,
  notFound,
}

interface IException {
  type: Exclude<keyof typeof Exceptions, 'HttpException'>;
  loc: string;
  code?: ErrorCode;
  msg?: string;
  error?: any;
}
export default ({ type, loc, code, msg = '', error }: IException) =>
  new Exceptions[type]({
    loc,
    msg: `EC-ERROR/${code}/${msg}`,
    ...error,
  });
