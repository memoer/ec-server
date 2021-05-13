import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig, redisConfig } from '~/@config/register';
import DatabaseFactory from './db.factory';

export const DBModule = TypeOrmModule.forRootAsync({
  useFactory: DatabaseFactory,
  inject: [dbConfig.KEY, redisConfig.KEY],
});
