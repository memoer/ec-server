import { redisStore } from 'cache-manager-redis-store';
import { CacheModuleOptions } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import redisConfig from '~/@config/redis.config';

export default async (
  rc: ConfigType<typeof redisConfig>,
): Promise<CacheModuleOptions> => ({
  store: redisStore,
  host: rc.REDIS_HOST,
  port: +rc.REDIS_PORT,
});
