import { AuthGuard } from '../../../src/_lib/guard/auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
