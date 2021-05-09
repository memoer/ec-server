import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AwsService } from '~/aws/aws.service';
import { JwtService } from '~/jwt/jwt.service';
import { LogInUserInput } from '~/user/dto/logInUser.dto';
import { User, UserInfo } from '~/user/entity';
import { UserService } from '~/user/user.service';
import { UtilService } from '~/util/util.service';
import exception from '~/_lib/exception';
// import {
//   cacheManagerMock,
//   dbConnMock,
//   utilServiceMock,
//   awsServiceMock,
//   jwtServiceMock,
// } from '@/common';
import { SendVerifyCodeUserInput } from '~/user/dto/sendVerifyCodeUser.dto';

describe('UserService', () => {
  const cacheManagerMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
  const dbConnMock = {};
  const utilServiceMock = {
    removeUndefinedOf: jest.fn(),
    getMs: jest.fn(),
  };
  const awsServiceMock = {
    sendEmail: jest.fn(),
    sendSMS: jest.fn(),
  };
  const jwtServiceMock = { sign: jest.fn() };

  let userService: UserService;
  let userRepo: ReturnType<typeof repositoryMock>;
  let userInfoRepo: ReturnType<typeof repositoryMock>;
  let cacheManager: typeof cacheManagerMock;
  let dbConn: typeof dbConnMock;
  let utilService: typeof utilServiceMock;
  let awsService: typeof awsServiceMock;
  let jwtService: typeof jwtServiceMock;

  const repositoryMock = () => ({
    findOneOrFail: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: repositoryMock() },
        { provide: getRepositoryToken(UserInfo), useValue: repositoryMock() },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        { provide: Connection, useValue: dbConnMock },
        { provide: UtilService, useValue: utilServiceMock },
        { provide: AwsService, useValue: awsServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    userInfoRepo = module.get(getRepositoryToken(UserInfo));
    cacheManager = module.get(CACHE_MANAGER);
    dbConn = module.get(Connection);
    utilService = module.get(UtilService);
    awsService = module.get(AwsService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepo).toBeDefined();
    expect(userInfoRepo).toBeDefined();
    expect(cacheManager).toBeDefined();
    expect(dbConn).toBeDefined();
    expect(utilService).toBeDefined();
    expect(awsService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('logInUser', () => {
    const args: LogInUserInput = {
      password: 'password',
      nickname: 'nickname',
      phoneNumber: '+821012341234',
    };

    it('invalid password, throw exception', async () => {
      // ? init variables
      const returnData = {
        removeUndefinedOf: 'removeUndefinedOf',
        user: { verifyPassword: false },
        userRepo: {
          findOneOrFail: {
            verifyPassword: jest.fn().mockResolvedValue(false),
          },
        },
      };
      // ? init mock
      userRepo.findOneOrFail.mockResolvedValue(
        returnData.userRepo.findOneOrFail,
      );
      utilService.removeUndefinedOf.mockReturnValue(
        returnData.removeUndefinedOf,
      );
      try {
        // ? run
        await userService.logInUser(args);
        // ? test
      } catch (error) {
        expect(userRepo.findOneOrFail).toHaveBeenNthCalledWith(
          1,
          returnData.removeUndefinedOf,
          { select: ['id', 'password'] },
        );
        expect(utilService.removeUndefinedOf).toHaveBeenNthCalledWith(1, {
          nickname: args.nickname,
          phoneNumber: args.phoneNumber,
        });
        expect(
          returnData.userRepo.findOneOrFail.verifyPassword,
        ).toHaveBeenNthCalledWith(1, args.password);
        expect(error).toMatchObject(
          exception({
            type: 'ForbiddenException',
            name: 'UserService/logIn',
            msg: 'password invalid',
          }),
        );
      }
    });

    it('valid password, return token', async () => {
      // ? init variables
      const returnData = {
        removeUndefinedOf: 'removeUndefinedOf',
        result: 'success',
        userRepo: {
          findOneOrFail: {
            verifyPassword: jest.fn().mockResolvedValue(true),
            id: '1',
          },
        },
      };
      // ? init mock
      userRepo.findOneOrFail.mockResolvedValue(
        returnData.userRepo.findOneOrFail,
      );
      utilService.removeUndefinedOf.mockReturnValue(
        returnData.removeUndefinedOf,
      );
      jwtService.sign.mockReturnValue(returnData.result);
      // ? run
      const result = await userService.logInUser(args);
      // ? test
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        returnData.userRepo.findOneOrFail.id,
      );
      expect(result).toEqual(returnData.result);
    });
  });

  describe('sendVerifyCodeUser', () => {
    const sharedReturnData = {
      cacheManager: { get: false },
      utilService: { getMs: 3000 },
    };
    const commonMockReturn = () => {
      cacheManager.get.mockResolvedValue(sharedReturnData.cacheManager.get);
      utilService.getMs.mockReturnValue(sharedReturnData.utilService.getMs);
    };
    it('phoeNumber', async () => {
      // ? init variables
      const returnData = {
        result: true,
      };
      const args: SendVerifyCodeUserInput = {
        phoneNumber: '+821012341234',
      };
      // ? init mocks
      commonMockReturn();
      // ? run
      const result = await userService.sendVerifyCodeUser(args);
      // ? test
      expect(cacheManager.get).toHaveBeenNthCalledWith(1, expect.any(String));
      expect(utilService.getMs).toHaveBeenNthCalledWith(1, {
        value: 3,
        type: 'minute',
      });
      expect(cacheManager.set).toHaveBeenNthCalledWith(
        1,
        args.phoneNumber,
        expect.any(String),
        { ttl: sharedReturnData.utilService.getMs / 1000 },
      );
      expect(awsService.sendSMS).toHaveBeenNthCalledWith(1, {
        Message: expect.any(String),
        PhoneNumber: args.phoneNumber,
      });
      expect(result).toEqual(returnData.result);
    });

    it('email', async () => {
      // ? init variables
      const returnData = {
        result: true,
      };
      const args: SendVerifyCodeUserInput = {
        email: 'test@naver.com',
      };
      // ? init mocks
      commonMockReturn();
      // ? run
      const result = await userService.sendVerifyCodeUser(args);
      // ? test
      expect(awsService.sendEmail).toHaveBeenNthCalledWith(1, {
        to: args.email,
        subject: '[End Coumminty] 이메일 확인',
        text: expect.any(String),
      });
      expect(result).toEqual(returnData.result);
    });

    it('error', async () => {
      // ? init variables
      const returnData = {
        cacheManager: {
          get: [false, true],
        },
      };
      const returnException = {
        awsService: { sendEmail: new Error('test') },
      };
      const args: SendVerifyCodeUserInput = {
        email: 'test@naver.com',
      };
      // ? init mocks
      cacheManager.get.mockResolvedValueOnce(returnData.cacheManager.get[0]);
      cacheManager.get.mockResolvedValueOnce(returnData.cacheManager.get[1]);
      cacheManager.del.mockResolvedValueOnce(true);
      utilService.getMs.mockReturnValue(sharedReturnData.utilService.getMs);
      awsService.sendEmail.mockRejectedValue(
        returnException.awsService.sendEmail,
      );
      try {
        // ? run
        await userService.sendVerifyCodeUser(args);
      } catch (error) {
        // ? test
        expect(cacheManager.get).toHaveBeenCalledTimes(2);
        expect(cacheManager.del).toHaveBeenNthCalledWith(1, expect.any(String));
        expect(error).toMatchObject(returnException.awsService.sendEmail);
      }
    });
  });
});
