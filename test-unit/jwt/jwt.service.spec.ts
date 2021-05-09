import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import appConfig from '~/@config/app.config';
import { JwtService } from '~/jwt/jwt.service';
const TOKEN = 'TOKEN';
const USER_ID = 1;
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => TOKEN),
  verify: jest.fn(() => ({ id: USER_ID })),
}));

describe('JwtService', () => {
  let jwtService: JwtService;
  const appConfigMock = { JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: appConfig.KEY, useValue: appConfigMock },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('sign', () => {
    // ? run
    const result = jwtService.sign(USER_ID);
    // ? test
    expect(typeof result).toBe('string');
    expect(jwt.sign).toHaveBeenNthCalledWith(
      1,
      { id: USER_ID },
      appConfigMock.JWT_PRIVATE_KEY,
    );
    expect(result).toEqual(TOKEN);
  });

  it('verify', () => {
    // ? run
    const result = jwtService.verify(TOKEN);
    // ? test
    expect(jwt.verify).toHaveBeenNthCalledWith(
      1,
      TOKEN,
      appConfigMock.JWT_PRIVATE_KEY,
    );
    expect(result).toEqual({ id: USER_ID });
  });
});
