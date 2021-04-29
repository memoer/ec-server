import { Injectable } from '@nestjs/common';
import { DEFAULT_VALUE } from '~/_lib/constants';
import { PaginationInput } from './dto/pagination.dto';
import { GetMs, IUtilService } from './util.interface';

@Injectable()
export class UtilService implements IUtilService {
  //
  getSkip({
    pageNumber = DEFAULT_VALUE.PAGE_NUMBER,
    take = DEFAULT_VALUE.TAKE,
  }: PaginationInput = {}) {
    return (pageNumber - 1) * take;
  }
  /**
   * comment test
   * @param value
   * @param type
   * @returns milliseconds good?
   * @description desc
   */
  getMs({ value, type }: GetMs['args']): number {
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
  getRandNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
