import { Module } from '@nestjs/common';
import CacheModule from '~/@cache/cache.module';
import { UserEntity } from '~/@database/entities/user.entity';
import { UtilModule } from '~/util/util.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '~/aws/aws.module';

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forFeature([UserEntity]),
    UtilModule,
    AwsModule,
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
