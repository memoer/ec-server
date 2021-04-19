import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/@config/database.config';
import DatabaseFactory from './db.factory';
import redisConfig from 'src/@config/redis.config';

export default TypeOrmModule.forRootAsync({
  useFactory: DatabaseFactory,
  inject: [databaseConfig.KEY, redisConfig.KEY],
});
