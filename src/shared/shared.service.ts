import { Injectable } from '@nestjs/common';
import { DEFAULT_VALUE } from '~/lib/constants';
import { PaginationInput } from './dto/pagination.dto';
import {
  GetMsInput,
  GetValueFromMetaDataInput,
  ISharedService,
} from './shared.interface';

@Injectable()
export class SharedService implements ISharedService {
  //
  getSkip({
    pageNumber = DEFAULT_VALUE.PAGE_NUMBER,
    take = DEFAULT_VALUE.TAKE,
  }: PaginationInput) {
    return (pageNumber - 1) * take;
  }
  /**
   * comment test
   * @param value
   * @param type
   * @returns milliseconds good?
   * @description desc
   */
  getMs({ value, type }: GetMsInput): number {
    const oneMs = 1000;
    const oneSecond = 1 * oneMs;
    const oneMinue = 60 * oneSecond;
    const oneHour = 60 * oneMinue;
    const oneDay = 24 * oneHour;
    switch (type) {
      case 'day':
        return value * oneDay;
      case 'hour':
        return value * oneHour;
      case 'minute':
        return value * oneMinue;
      case 'second':
        return value * oneSecond;
      default:
        return value * oneMs;
    }
  }

  getValueFromMetaData<T, U = any>({
    reflector,
    context,
    keyObj,
  }: GetValueFromMetaDataInput) {
    return Object.keys(keyObj).reduce((obj: Record<string, any>, key) => {
      const value = reflector.get(key, context.getHandler());
      obj[key] = value;
      return obj;
    }, {}) as Record<keyof T, U>;
  }
}
