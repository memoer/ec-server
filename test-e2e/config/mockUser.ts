import { User } from '~/user/entity';

const userMockData = {
  id: 1,
  phoneNumber: '+821000000000',
  password: 'Q!w2e3r4t5',
};
//  > a = new Date('2000-01-01')
// 2000-01-01T00:00:00.000Z
//   birthDate: new Date('2000-01-01'),
export default class MockUser {
  user = userMockData;
  token!: string;
  updateUser(updateData: Partial<User>) {
    this.user = { ...this.user, ...updateData };
  }
}
