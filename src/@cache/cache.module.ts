import { CacheModule as CacheM } from '@nestjs/common';
import { redisConfig } from '~/@config/register';
import cacheFactory from './cache.factory';

export const CacheModule = CacheM.registerAsync({
  useFactory: cacheFactory,
  inject: [redisConfig.KEY],
});
