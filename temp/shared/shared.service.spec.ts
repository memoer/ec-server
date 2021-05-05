import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from '~/util/util.service';

describe('shared/shared.service', () => {
  let service: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get<UtilService>(UtilService);
  });

  describe('getSkip', () => {
    it('(), should return 0', () => {
      service.getSkip();
    });

    it('({pageNumber: 1, take: 10}), should return 10', () => {
      service.getSkip({ pageNumber: 1, take: 10 });
    });
  });

  describe('getMs', () => {
    const oneMs = 1000;
    const oneMinute = 60 * oneMs;
    it('({value: 1, type: "ms"}), should return data is 1000', () => {
      // ? run
      const result = service.getMs({ value: 1, type: 'ms' });
      // ? test
      expect(result).toBe(oneMs);
    });

    it('({value: 1, type: "second"}), should return data is 1000', () => {
      // ? run
      const result = service.getMs({ value: 1, type: 'second' });
      // ? test
      expect(result).toBe(oneMs);
    });

    it('({value: 1, type: "minute"}), should return data is 60 * 1000', () => {
      // ? run
      const result = service.getMs({ value: 1, type: 'minute' });
      // ? test
      expect(result).toBe(oneMinute);
    });

    it('({value: 1, type: "hour"}), should return data is 60 * 60 * 1000', () => {
      // ? run
      const result = service.getMs({ value: 1, type: 'hour' });
      // ? test
      expect(result).toBe(60 * oneMinute);
    });

    it('({value: 1, type: "day"}), should return data is 24 * 60 * 60 * 1000', () => {
      // ? run
      const result = service.getMs({ value: 1, type: 'day' });
      // ? test
      expect(result).toBe(24 * 60 * oneMinute);
    });
  });
});
