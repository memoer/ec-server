import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Like } from 'typeorm';
import { AwsService } from '~/aws/aws.service';
import { JwtService } from '~/jwt/jwt.service';
import { UserService } from '~/user/user.service';
import { UtilService } from '~/util/util.service';
import { User, UserInfo, UserSex } from '~/user/entity';
import * as nicknameList from '~/user/lib/nicknameList.json';
import { exception } from '~/_lib';
import {
  CreateUserInput,
  LogInUserInput,
  SendVerifyCodeUserInput,
  CheckVerifyCodeUserInput,
  FindAllUserInput,
  FindOneUserInput,
  UpdateUserInput,
  RemoveUserInput,
  RestoreUserInput,
} from '~/user/dto';
import {
  cacheManagerMock,
  dbConnMock,
  utilServiceMock,
  awsServiceMock,
  jwtServiceMock,
  repositoryMock,
  getCallback,
} from '@/common';
import getUserMock from '@/getUserMock';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: ReturnType<typeof repositoryMock>;
  let userInfoRepo: ReturnType<typeof repositoryMock>;
  let cacheManager: typeof cacheManagerMock;
  let dbConn: typeof dbConnMock;
  let utilService: typeof utilServiceMock;
  let awsService: typeof awsServiceMock;
  let jwtService: typeof jwtServiceMock;
  const userMock = getUserMock();

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
            type: 'UnauthorizedException',
            loc: 'UserService.logIn',
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
    it('phoneNumber', async () => {
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

  describe('checkVerifyCodeUser', () => {
    it('verifyCode invalid, throw exception', async () => {
      // ? init variables
      const args: CheckVerifyCodeUserInput = {
        phoneNumber: 'phoneNumber',
        verifyCode: 'verifyCode',
      };
      const returnData = {
        cacheManager: { get: 'cache' },
      };
      // ? init mock
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      try {
        // ? run
        await userService.checkVerifyCodeUser(args);
      } catch (error) {
        // ? test
        expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.phoneNumber);
        expect(error).toMatchObject(
          exception({
            type: 'UnauthorizedException',
            loc: 'UserService.createUser',
            msg: 'served verifyCode invalid',
          }),
        );
      }
    });

    it('verifyCode valid, return true', async () => {
      // ? init variables
      const args: CheckVerifyCodeUserInput = {
        email: 'email',
        verifyCode: 'verifyCode',
      };
      const returnData = {
        cacheManager: { get: 'verifyCode' },
        utilService: { getMs: 3000 },
        result: true,
      };
      // ? init mock
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      utilService.getMs.mockReturnValue(returnData.utilService.getMs);
      // ? run
      const result = await userService.checkVerifyCodeUser(args);
      // ? test
      expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.email);
      expect(utilService.getMs).toHaveBeenNthCalledWith(1, {
        value: 30,
        type: 'minute',
      });
      expect(cacheManager.set).toHaveBeenNthCalledWith(1, args.email, true, {
        ttl: returnData.utilService.getMs / 1000,
      });
      expect(result).toEqual(returnData.result);
    });
  });

  describe('createUser', () => {
    const args: CreateUserInput = {
      phoneNumber: 'phoneNumber',
      sex: UserSex.FEMALE,
      birthDate: new Date(),
      password: 'Qwesdwd1234@',
      country: 'kr',
    };

    it('cache invalid, throw exception', async () => {
      // ? init variables
      const returnData = {
        utilService: { getRandNum: 0 },
        userRepo: { find: [{ nickname: nicknameList[0] }] },
        cacheManager: { get: false },
      };
      // ? init mock
      utilService.getRandNum.mockReturnValue(returnData.utilService.getRandNum);
      userRepo.find.mockResolvedValue(returnData.userRepo.find);
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      try {
        // ? run
        await userService.createUser(args);
      } catch (error) {
        // ? test
        expect(utilService.getRandNum).toHaveBeenNthCalledWith(
          1,
          0,
          nicknameList.length,
        );
        expect(userRepo.find).toHaveBeenNthCalledWith(1, {
          select: ['nickname'],
          where: {
            nickname: Like(
              `${nicknameList[returnData.utilService.getRandNum]}%`,
            ),
          },
          take: 1,
          order: { nickname: 'DESC' },
        });
        expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.phoneNumber);
        expect(error).toMatchObject(
          exception({
            type: 'UnauthorizedException',
            loc: 'UserService.createUser',
            msg: 'verifyCode stored cache must be checked',
          }),
        );
      }
    });

    it('cache invalid, throw exception', async () => {
      // ? init variables
      const returnData = {
        utilService: { getRandNum: 0 },
        userRepo: {
          find: [{ nickname: nicknameList[0] }],
          create: 'newUserEntity',
        },
        userInfoRepo: {
          create: { name: 'newUserInfoEntity' },
        },
        cacheManager: { get: true },
        dbConn: { transaction: { id: '1' } },
        dbManagerMock: { save: ['newUser'] },
        jwtService: { sign: 'token' },
      };
      // ? init mock
      const dbManagerMock = {
        save: jest.fn(),
      };
      utilService.getRandNum.mockReturnValue(returnData.utilService.getRandNum);
      userRepo.find.mockResolvedValue(returnData.userRepo.find);
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      userRepo.create.mockReturnValue(returnData.userRepo.create);
      userInfoRepo.create.mockReturnValue(returnData.userInfoRepo.create);
      dbConn.transaction.mockResolvedValue(returnData.dbConn.transaction);
      dbManagerMock.save.mockResolvedValueOnce(
        returnData.dbManagerMock.save[0],
      );
      jwtService.sign.mockReturnValue(returnData.jwtService.sign);
      // ? run
      const result = await userService.createUser(args);
      await getCallback(dbConn.transaction, 1)(dbManagerMock);
      // ? test
      expect(utilService.getRandNum).toHaveBeenNthCalledWith(
        1,
        0,
        nicknameList.length,
      );
      expect(userRepo.find).toHaveBeenNthCalledWith(1, {
        select: ['nickname'],
        where: {
          nickname: Like(`${nicknameList[returnData.utilService.getRandNum]}%`),
        },
        take: 1,
        order: { nickname: 'DESC' },
      });
      expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.phoneNumber);
      expect(userRepo.create).toHaveBeenNthCalledWith(1, {
        phoneNumber: args.phoneNumber,
        sex: args.sex,
        birthDate: args.birthDate,
        password: args.password,
        nickname: `${nicknameList[0]}1`,
      });
      expect(userInfoRepo.create).toHaveBeenNthCalledWith(1, {
        country: args.country,
      });
      expect(dbConn.transaction).toHaveBeenNthCalledWith(
        1,
        'SERIALIZABLE',
        expect.any(Function),
      );
      expect(dbManagerMock.save).toHaveBeenNthCalledWith(
        1,
        returnData.userRepo.create,
      );
      expect(dbManagerMock.save).toHaveBeenNthCalledWith(2, {
        ...returnData.userInfoRepo.create,
        user: returnData.dbManagerMock.save[0],
      });
      expect(cacheManager.del).toHaveBeenNthCalledWith(1, args.phoneNumber);
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        returnData.dbConn.transaction.id,
      );
      expect(result).toEqual({
        data: returnData.dbConn.transaction,
        token: returnData.jwtService.sign,
      });
    });
  });

  it('findAllUser', async () => {
    // ? init variables
    const args: FindAllUserInput = {
      pageNumber: 1,
      take: 1,
      email: 'test@naver.com',
      nickname: 'nickname',
      sex: UserSex.FEMALE,
    };
    const returnData = {
      userRepo: { findAndCount: ['good', 1] },
      utilService: { getSkip: 1 },
    };
    // ? init mock
    userRepo.findAndCount.mockResolvedValue(returnData.userRepo.findAndCount);
    utilService.getSkip.mockReturnValue(returnData.utilService.getSkip);
    // ? run
    const result = await userService.findAllUser(args);
    // ? test
    expect(utilService.getSkip).toHaveBeenNthCalledWith(1, {
      pageNumber: args.pageNumber,
      take: args.take,
    });
    expect(userRepo.findAndCount).toHaveBeenNthCalledWith(1, {
      take: args.take,
      skip: returnData.utilService.getSkip,
      where: {
        email: Like(`%${args.email}%`),
        nickname: Like(`%${args.nickname}%`),
        sex: args.sex,
      },
    });
    expect(result).toEqual(returnData.userRepo.findAndCount);
  });

  it('findOneUser', async () => {
    // ? init variables
    const args: FindOneUserInput = {
      nickname: 'nickname',
      email: 'email',
      id: 1,
    };
    const returnData = {
      userRepo: { findOneOrFail: 'findOneOrFail' },
      utilService: { removeUndefinedOf: 'removeUndefinedOf' },
    };
    // ? init mock
    userRepo.findOneOrFail.mockResolvedValue(returnData.userRepo.findOneOrFail);
    utilService.removeUndefinedOf.mockReturnValue(
      returnData.utilService.removeUndefinedOf,
    );
    // ? run
    const result = await userService.findOneUser(args);
    // ? test
    expect(userRepo.findOneOrFail).toHaveBeenNthCalledWith(
      1,
      returnData.utilService.removeUndefinedOf,
    );
    expect(utilService.removeUndefinedOf).toHaveBeenNthCalledWith(1, args);
    expect(result).toEqual(returnData.userRepo.findOneOrFail);
  });

  describe('updateUser', () => {
    it('if cache invalid, throw exception', async () => {
      // ? init variables
      const args: UpdateUserInput = {
        sex: UserSex.FEMALE,
        birthDate: new Date(),
        password: '',
        nickname: '',
        thumbnail: '',
        email: '',
      };
      const returnData = {
        cacheManager: { get: false },
      };
      // ? init mock
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      try {
        // ? run
        await userService.updateUser(userMock, args);
      } catch (error) {
        // ? test
        expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.email);
        expect(error).toMatchObject(
          exception({
            type: 'UnauthorizedException',
            loc: 'UserService.createUser',
            msg: 'verifyCode stored cache must be checked',
          }),
        );
      }
    });

    it('succeefully execute', async () => {
      // ? init variables
      const args: UpdateUserInput = {
        sex: UserSex.FEMALE,
        birthDate: new Date(),
        password: 'password',
        nickname: 'nickname',
        thumbnail: 'thumbnail',
        phoneNumber: 'phoneNumber',
      };
      const returnData = {
        cacheManager: { get: true },
        userRepo: { create: 'userRepo', save: 'save' },
      };
      // ? init mock
      cacheManager.get.mockResolvedValue(returnData.cacheManager.get);
      userRepo.create.mockReturnValue(returnData.userRepo.create);
      userRepo.save.mockReturnValue(returnData.userRepo.save);
      // ? run
      const result = await userService.updateUser(userMock, args);
      // ? test
      expect(cacheManager.get).toHaveBeenNthCalledWith(1, args.phoneNumber);
      expect(userRepo.create).toHaveBeenNthCalledWith(1, {
        ...userMock,
        sex: args.sex,
        birthDate: args.birthDate,
        password: args.password,
        nickname: args.nickname,
        thumbnail: args.thumbnail,
      });
      expect(userRepo.save).toHaveBeenNthCalledWith(
        1,
        returnData.userRepo.create,
      );
      expect(result).toEqual(returnData.userRepo.save);
    });
  });

  it('removeUser', async () => {
    // ? init variables
    const args: RemoveUserInput = { reason: 'reason' };
    const returnData = {
      userInfoRepo: { update: 'update' },
      userRepo: { softDelete: 'softDelete' },
      result: true,
    };
    // ? init mock
    userInfoRepo.update.mockReturnValue(returnData.userInfoRepo.update);
    userRepo.softDelete.mockReturnValue(returnData.userRepo.softDelete);
    // ? run
    const result = await userService.removeUser(userMock, args);
    // ? test
    expect(userInfoRepo.update).toHaveBeenNthCalledWith(1, userMock.nickname, {
      reason: `[탈퇴] ${args.reason}`,
    });
    expect(userRepo.softDelete).toHaveBeenNthCalledWith(1, userMock.id);
    expect(result).toEqual(returnData.result);
  });

  describe('restoreUser', () => {
    it('password invalid, throw exception', async () => {
      // ? init variables
      const args: RestoreUserInput = {
        reason: 'reason',
        nickname: 'nickname',
        phoneNumber: 'phoneNumber',
        password: 'q1w2e3',
      };
      const returnData = {
        userRepo: {
          findOneOrFail: { verifyPassword: jest.fn().mockResolvedValue(false) },
        },
        utilService: { removeUndefinedOf: 'removeUndefinedOf' },
      };
      // ? init mock
      userRepo.findOneOrFail.mockResolvedValue(
        returnData.userRepo.findOneOrFail,
      );
      utilService.removeUndefinedOf.mockReturnValue(
        returnData.utilService.removeUndefinedOf,
      );
      try {
        // ? run
        await userService.restoreUser(args);
      } catch (error) {
        // ? test
        expect(userRepo.findOneOrFail).toHaveBeenNthCalledWith(
          1,
          returnData.utilService.removeUndefinedOf,
          { withDeleted: true, select: ['id', 'nickname', 'password'] },
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
            type: 'UnauthorizedException',
            loc: 'UserService.restoreUser',
            msg: 'password invalid',
          }),
        );
      }
    });

    it('success', async () => {
      // ? init variables
      const args: RestoreUserInput = {
        reason: 'reason',
        nickname: 'nickname',
        phoneNumber: 'phoneNumber',
        password: 'q1w2e3',
      };
      const returnData = {
        userRepo: {
          findOneOrFail: {
            verifyPassword: jest.fn().mockResolvedValue(true),
            id: 1,
            nickname: 'nickname',
          },
          restore: 'restore',
        },
        utilService: { removeUndefinedOf: 'removeUndefinedOf' },
        userInfoRepo: { update: 'update' },
        result: true,
      };
      // ? init mock
      userRepo.findOneOrFail.mockResolvedValue(
        returnData.userRepo.findOneOrFail,
      );
      utilService.removeUndefinedOf.mockReturnValue(
        returnData.utilService.removeUndefinedOf,
      );
      userInfoRepo.update.mockReturnValue(returnData.userInfoRepo.update);
      userRepo.restore.mockReturnValue(returnData.userRepo.restore);
      // ? run
      const result = await userService.restoreUser(args);
      // ? test
      expect(userRepo.findOneOrFail).toHaveBeenNthCalledWith(
        1,
        returnData.utilService.removeUndefinedOf,
        { withDeleted: true, select: ['id', 'nickname', 'password'] },
      );
      expect(utilService.removeUndefinedOf).toHaveBeenNthCalledWith(1, {
        nickname: args.nickname,
        phoneNumber: args.phoneNumber,
      });
      expect(
        returnData.userRepo.findOneOrFail.verifyPassword,
      ).toHaveBeenNthCalledWith(1, args.password);
      expect(userInfoRepo.update).toHaveBeenNthCalledWith(
        1,
        returnData.userRepo.findOneOrFail.nickname,
        {
          reason: `[복귀] ${args.reason}`,
        },
      );
      expect(userRepo.restore).toHaveBeenNthCalledWith(
        1,
        returnData.userRepo.findOneOrFail.id,
      );
      expect(result).toEqual(returnData.result);
    });
  });
});
