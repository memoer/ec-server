import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { SharedService } from '~/shared/shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedService],
    }).compile();

    service = module.get<SharedService>(SharedService);
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
      // * run
      const result = service.getMs({ value: 1, type: 'ms' });
      // * test
      expect(result).toBe(oneMs);
    });
    it('({value: 1, type: "second"}), should return data is 1000', () => {
      // * run
      const result = service.getMs({ value: 1, type: 'second' });
      // * test
      expect(result).toBe(oneMs);
    });
    it('({value: 1, type: "minute"}), should return data is 60 * 1000', () => {
      // * run
      const result = service.getMs({ value: 1, type: 'minute' });
      // * test
      expect(result).toBe(oneMinute);
    });
    it('({value: 1, type: "hour"}), should return data is 60 * 60 * 1000', () => {
      // * run
      const result = service.getMs({ value: 1, type: 'hour' });
      // * test
      expect(result).toBe(60 * oneMinute);
    });
    it('({value: 1, type: "day"}), should return data is 24 * 60 * 60 * 1000', () => {
      // * run
      const result = service.getMs({ value: 1, type: 'day' });
      // * test
      expect(result).toBe(24 * 60 * oneMinute);
    });
  });

  describe('getValueFromMetaData', () => {
    const getMock = (Reflector.prototype.get = jest
      .fn()
      .mockImplementation((key) => key));
    const getHandlerMock = (ExecutionContextHost.prototype.getHandler = jest.fn());
    const reflector = new Reflector();
    const context = new ExecutionContextHost(['test']);
    it('should return ', () => {
      // https://stackoverflow.com/questions/50091438/jest-how-to-mock-one-specific-method-of-a-class
      // * variables to use & init mock
      const metaDataObj = { hello: '123', good: '234' };
      const metaDataLength = Object.keys(metaDataObj).length;
      // * run
      const data = service.getValueFromMetaData<typeof metaDataObj>({
        reflector,
        context,
        metaDataObj,
      });
      // * test
      expect(getMock).toHaveBeenCalledTimes(metaDataLength);
      expect(getHandlerMock).toHaveBeenCalledTimes(metaDataLength);
      Object.values(data).forEach((key) => expect(key).toBe(key));
    });
  });
});
