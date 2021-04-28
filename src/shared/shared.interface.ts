import { PaginationInput } from './dto/pagination.dto';

export interface GetMsInput {
  value: number;
  type: 'day' | 'hour' | 'minute' | 'second' | 'ms';
}

export interface ISharedService {
  getSkip(opts: PaginationInput): number;
  getMs(opts: GetMsInput): number;
}
