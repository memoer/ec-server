import * as Exceptions from '@nestjs/common/exceptions';

interface IException {
  type: Exclude<keyof typeof Exceptions, 'HttpException'>;
  name: string;
  msg?: string;
  error?: any;
}
export default ({ type, name, msg, error }: IException) =>
  new Exceptions[type]({
    name,
    msg,
    ...error,
  });
