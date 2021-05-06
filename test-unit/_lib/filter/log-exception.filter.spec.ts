import { LogExceptionFilter } from '~/_lib/filter/log-exception.filter';

describe('LogExceptionFilter', () => {
  it('should be defined', () => {
    expect(new LogExceptionFilter()).toBeDefined();
  });
});
