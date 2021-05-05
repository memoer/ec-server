import { UserBaseService } from '../../src/user/user.base.service';

describe('User', () => {
  it('should be defined', () => {
    expect(new UserBaseService()).toBeDefined();
  });
});
