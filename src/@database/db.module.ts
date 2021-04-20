import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '~/@config/database.config';
import redisConfig from '~/@config/redis.config';
import DatabaseFactory from './db.factory';

export default TypeOrmModule.forRootAsync({
  useFactory: DatabaseFactory,
  inject: [databaseConfig.KEY, redisConfig.KEY],
});
