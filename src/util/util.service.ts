import { Injectable } from '@nestjs/common';
import { DEFAULT_VALUE } from '~/_lib';
import { PaginationInputBySkip } from '../_lib';
import { GetMs } from './util.interface';

@Injectable()
export class UtilService {
  //
  getSkip({
    pageNumber = DEFAULT_VALUE.PAGE_NUMBER,
    take = DEFAULT_VALUE.TAKE,
  }: PaginationInputBySkip = {}) {
    return (pageNumber - 1) * take;
  }
  /**
   * comment test
   * @param value
   * @param type
   * @returns milliseconds good?
   * @description desc
   */
  getMs({ value, type }: GetMs): number {
    switch (type) {
      case 'day':
        return value * 24 * 60 * 60 * 1000;
      case 'hour':
        return value * 60 * 60 * 1000;
      case 'minute':
        return value * 60 * 1000;
      case 'second':
        return value * 1000;
    }
  }

  getRandNum(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * @description typeORM에서 conditions에 사용하기 위함
   * @example findOne에서 conditions가 {nickanme:"12", phoneNumber:undefined}일 경우,
   * 결과가 올바르게 나오지 않음
   * undefined || null 인 데이터를 없앰 -> removeUndefinedOf()
   */
  removeUndefinedOf(obj: Record<string, any>) {
    return Object.keys(obj).reduce<Record<string, any>>((o, key) => {
      if (obj[key] !== undefined) o[key] = obj[key];
      return o;
    }, {});
  }
}
