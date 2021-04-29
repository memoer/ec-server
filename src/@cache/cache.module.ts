import { CacheModule } from '@nestjs/common';
import redisConfig from '~/@config/redis.config';
import cacheFactory from './cache.factory';

export default CacheModule.registerAsync({
  useFactory: cacheFactory,
  inject: [redisConfig.KEY],
});
