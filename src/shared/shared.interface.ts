import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PaginationInput } from './dto/pagination.dto';

export interface GetMsInput {
  value: number;
  type: 'day' | 'hour' | 'minute' | 'second' | 'ms';
}

export interface GetValueFromMetaDataInput {
  reflector: Reflector;
  context: ExecutionContext;
  keyObj: Record<string, string>;
}

export interface ISharedService {
  getSkip(opts: PaginationInput): number;
  getMs(opts: GetMsInput): number;
  getValueFromMetaData<T>(
    opts: GetValueFromMetaDataInput,
  ): Record<keyof T, any>;
}
