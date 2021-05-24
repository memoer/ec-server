import { ConfigType } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import Redis from 'ioredis';
import { join } from 'path';
import { appConfig, redisConfig } from '~/@config/register';
import { isEnv } from '~/_lib';
import { GqlCtx } from './graphql.interface';

export default (
  ac: ConfigType<typeof appConfig>,
  rc: ConfigType<typeof redisConfig>,
): GqlModuleOptions => ({
  introspection: isEnv('local') || isEnv('dev'),
  playground: isEnv('local') || isEnv('dev'),
  debug: !isEnv('prod'),
  // throttler 사용하려면 res까지 리턴해야 한다.
  context: ({ req, res }: GqlCtx) => ({ req, res }),
  installSubscriptionHandlers: true,
  uploads: {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 5,
  },
  autoSchemaFile: join(__dirname, '..', 'schema.gql'),
  cors: {
    origin: [ac.CORS_ORIGIN, 'https://studio.apollographql.com'],
    credentials: true,
  },
  cache: new BaseRedisCache({
    client: new Redis({
      host: rc.REDIS_HOST,
      port: rc.REDIS_PORT,
    }),
  }),
  cacheControl: { defaultMaxAge: ac.GQL_CACHE_DEFAULT_MAX_AGE },
});
