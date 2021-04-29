import { PaginationInput } from './dto/pagination.dto';

export interface GetMs {
  args: { value: number; type: 'day' | 'hour' | 'minute' | 'second' | 'ms' };
}

export interface IUtilService {
  getSkip(args: PaginationInput): number;
  getMs(args: GetMs['args']): number;
}
