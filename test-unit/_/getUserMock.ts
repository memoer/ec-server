import { User } from '~/user/entity';

export default () => {
  const _userMock = new User();
  _userMock.id = 1;
  _userMock.nickname = 'nickname';
  return _userMock;
};
