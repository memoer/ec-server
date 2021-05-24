import * as Exceptions from '@nestjs/common/exceptions';

interface IException {
  type: Exclude<keyof typeof Exceptions, 'HttpException'>;
  loc: string;
  msg?: string;
  error?: any;
}
export default ({ type, loc, msg, error }: IException) =>
  new Exceptions[type]({
    loc,
    msg: `EC-ERROR/${msg}`,
    ...error,
  });
