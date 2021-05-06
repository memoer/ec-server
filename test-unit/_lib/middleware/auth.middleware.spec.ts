import { AuthMiddleware } from '~/_lib/middleware/auth.middleware';
class JwtService {
  private readonly _appConfig: any;
  sign(userId: number) {
    return `sign_${userId}`;
  }
  verify(token: string) {
    return `verify_${token}`;
  }
}
class UserService {}
describe('', () => {
  // ? init variables
  const jwtService = new JwtService();
  const userService = new UserService();
  const authMiddleware = new AuthMiddleware(jwtService, userService);
  // ? init mock
  it('should be defined', () => {
    expect(new AuthMiddleware()).toBeDefined();
  });

  it('', () => {
    // ? init variables
    // ? init mock
    // ? run
    // ? test
  });
});
