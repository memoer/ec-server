import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from '~/util/util.service';

describe('shared/shared.utilService', () => {
  let utilService: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    utilService = module.get<UtilService>(UtilService);
  });

  describe('getSkip', () => {
    it('(), should return 0', () => {
      utilService.getSkip();
    });

    it('({pageNumber: 1, take: 10}), should return 10', () => {
      utilService.getSkip({ pageNumber: 1, take: 10 });
    });
  });

  describe('getMs', () => {
    const oneMs = 1000;
    const oneMinute = 60 * oneMs;

    it('({value: 1, type: "second"}), should return data is 1000', () => {
      // ? run
      const result = utilService.getMs({ value: 1, type: 'second' });
      // ? test
      expect(result).toBe(oneMs);
    });

    it('({value: 1, type: "minute"}), should return data is 60 * 1000', () => {
      // ? run
      const result = utilService.getMs({ value: 1, type: 'minute' });
      // ? test
      expect(result).toBe(oneMinute);
    });

    it('({value: 1, type: "hour"}), should return data is 60 * 60 * 1000', () => {
      // ? run
      const result = utilService.getMs({ value: 1, type: 'hour' });
      // ? test
      expect(result).toBe(60 * oneMinute);
    });

    it('({value: 1, type: "day"}), should return data is 24 * 60 * 60 * 1000', () => {
      // ? run
      const result = utilService.getMs({ value: 1, type: 'day' });
      // ? test
      expect(result).toBe(24 * 60 * oneMinute);
    });
  });

  it('getRandNum', () => {
    // ? init variables
    const min = 1;
    const max = 10;
    const returnData = {
      floor: 1,
      random: 2,
    };
    // ? init mock
    const floorMock = jest
      .spyOn(Math, 'floor')
      .mockReturnValue(returnData.floor);
    const randomMock = jest
      .spyOn(Math, 'random')
      .mockReturnValue(returnData.random);
    // ? run
    const result = utilService.getRandNum(min, max);
    // ? test
    expect(floorMock).toHaveBeenNthCalledWith(
      1,
      returnData.random * (max - min) + min,
    );
    expect(randomMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnData.floor);
  });

  it('removeUndefinedOf', () => {
    // ? init variables
    const obj = { name: 'good', age: null, country: undefined };
    const returnData = { name: 'good', age: null };
    // ? run
    const result = utilService.removeUndefinedOf(obj);
    // ? test
    expect(result).toEqual(returnData);
  });
});
