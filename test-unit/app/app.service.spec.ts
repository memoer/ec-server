import { Test, TestingModule } from '@nestjs/testing';
import * as requestIp from 'request-ip';
import * as geoIp from 'geoip-lite';
import { GqlCtx } from '~/@graphql/graphql.interface';
import { AppService } from '~/app/app.service';
import { exception } from '~/_lib';

describe('AppService', () => {
  let appService: AppService;
  const getClientIpMock = jest.spyOn(requestIp, 'getClientIp');
  const lookupMock = jest.spyOn(geoIp, 'lookup');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('if not exists clientIp ( no req.clientIp, requestIp.getClientIp ), throw exception', () => {
    // ? init variables
    const gqlCtxMock = ({ req: { clientIp: null } } as unknown) as GqlCtx;
    const returnData = {
      getClientIpMock: null,
    };
    // ? init mock
    getClientIpMock.mockReturnValue(returnData.getClientIpMock);
    try {
      // ? run
      appService.getGeo(gqlCtxMock.req);
    } catch (error) {
      // ? test
      expect(getClientIpMock).toHaveBeenNthCalledWith(1, gqlCtxMock.req);
      expect(error).toMatchObject(
        exception({
          type: 'NotFoundException',
          loc: 'AppResolver.getGeo',
          msg: 'no clientIp',
        }),
      );
    }
  });

  it('if not exists geo, throw exception', () => {
    // ? init variables
    const gqlCtxMock = ({ req: { clientIp: 'clientIp' } } as unknown) as GqlCtx;
    const returnData = {
      getClientIpMock: null,
      lookupMock: null,
    };
    // ? init mock
    getClientIpMock.mockReturnValue(returnData.getClientIpMock);
    lookupMock.mockReturnValue(returnData.lookupMock);
    try {
      // ? run
      appService.getGeo(gqlCtxMock.req);
    } catch (error) {
      // ? test
      expect(getClientIpMock).not.toHaveBeenCalled();
      expect(lookupMock).toHaveBeenNthCalledWith(1, gqlCtxMock.req.clientIp);
      expect(error).toMatchObject(
        exception({
          type: 'NotFoundException',
          loc: 'AppResolver.getGeo',
          msg: 'no clientIp',
        }),
      );
    }
  });

  it('successfully return geo data', () => {
    // ? init variables
    const gqlCtxMock = ({ req: { clientIp: null } } as unknown) as GqlCtx;
    const returnData = {
      getClientIpMock: 'clientIp',
      result: 'success',
    };
    // ? init mock
    getClientIpMock.mockReturnValue(returnData.getClientIpMock);
    lookupMock.mockReturnValue((returnData.result as unknown) as geoIp.Lookup);
    // ? run
    const result = appService.getGeo(gqlCtxMock.req);
    // ? test
    expect(getClientIpMock).toHaveBeenNthCalledWith(1, gqlCtxMock.req);
    expect(lookupMock).toHaveBeenNthCalledWith(1, returnData.getClientIpMock);
    expect(result).toEqual(returnData.result);
  });
});
