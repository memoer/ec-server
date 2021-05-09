import { Test, TestingModule } from '@nestjs/testing';
import { Connection, ConnectionManager } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NextFunction } from 'express';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { JwtService } from '~/jwt/jwt.service';
import { User } from '~/user/entity';
import exception from '~/_lib/exception';
import { AuthMiddleware } from '~/_lib/middleware/auth.middleware';
import { UserRelation } from '~/user/entity/user.entity';

describe('AuthMiddleware', () => {
  // ? init variables
  let authMiddleware: AuthMiddleware;
  let jwtService: typeof jwtServiceMock;
  // ? init mock
  const jwtServiceMock = { verify: jest.fn() };
  const nextMock: NextFunction = jest.fn();
  const gqlCtxMock = ({ req: { headers: {} }, res: null } as unknown) as GqlCtx;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    authMiddleware = module.get<AuthMiddleware>(AuthMiddleware);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authMiddleware).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('not authoization in req, next called once', () => {
    // ? run
    authMiddleware.use(gqlCtxMock.req, gqlCtxMock.res, nextMock);
    // ? test
    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  it('if authorization header type is not Bearer, throw exception', async () => {
    // ? init mock
    gqlCtxMock.req.headers = { authorization: 'A token' };
    try {
      // ? run
      await authMiddleware.use(gqlCtxMock.req, gqlCtxMock.res, nextMock);
    } catch (error) {
      // ? test
      expect(error).toMatchObject(
        exception({
          type: 'NotImplementedException',
          name: 'AuthMiddleware/use',
          msg: 'authorization header type invalid',
        }),
      );
    }
  });

  it('', () => {
    // ? init variables
    const token = 'token';
    const returnData = {
      repositoryMock: { findOne: 'user' },
      jwtServiceMock: {
        verify: {
          id: 1,
        },
      },
    };
    // ? init mock
    gqlCtxMock.req.headers = { authorization: `Bearer ${token}` };
    const repositoryMock = {
      findOne: jest.fn().mockResolvedValue(returnData.repositoryMock.findOne),
    };
    const getRepositoryMock = jest.fn().mockReturnValue(repositoryMock);
    ConnectionManager.prototype.get = () =>
      (({
        getRepository: getRepositoryMock,
      } as unknown) as Connection);

    jwtServiceMock.verify.mockReturnValue(returnData.jwtServiceMock.verify);
    // ? run
    authMiddleware.use(gqlCtxMock.req, gqlCtxMock.res, nextMock);
    // ? test
    expect(jwtServiceMock.verify).toHaveBeenNthCalledWith(1, token);
    expect(getRepositoryMock).toHaveBeenNthCalledWith(1, User);
    expect(repositoryMock.findOne).toHaveBeenNthCalledWith(
      1,
      returnData.jwtServiceMock.verify.id,
      {
        relations: [UserRelation.info],
      },
    );
  });
});
