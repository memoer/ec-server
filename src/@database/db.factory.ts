import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { LoggerOptions } from 'typeorm';
import databaseConfig from 'src/@config/database.config';
import redisConfig from 'src/@config/redis.config';
import isEnv from 'src/lib/isEnv';

export default (
  dbc: ConfigType<typeof databaseConfig>,
  rc: ConfigType<typeof redisConfig>,
): TypeOrmModuleOptions => {
  const logging = (): LoggerOptions => {
    switch (process.env.NODE_ENV) {
      case 'test':
        return false;
      case 'local':
        return 'all';
      case 'dev':
      case 'staging':
      case 'prod':
        return ['error', 'warn'];
    }
  };
  return {
    type: 'postgres',
    host: dbc.TYPEORM_HOST,
    username: dbc.TYPEORM_USERNAME,
    password: dbc.TYPEORM_PASSWORD,
    database: dbc.TYPEORM_DATABASE,
    port: dbc.TYPEORM_PORT,
    logging: logging(),
    synchronize: isEnv('local'), // on sync in local env
    entities: [join(__dirname, './entities')],
    // QueryBuilder methods: getMany, getOne, getRawMany, getRawOne and getCount.
    // Repository methods: find, findAndCount, findByIds, and count.
    cache: {
      type: 'redis',
      options: { host: rc.REDIS_HOST, port: rc.REDIS_PORT },
      duration: dbc.TYPEORM_CACHE_TTL,
    },
  };
};
