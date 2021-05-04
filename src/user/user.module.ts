import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '~/@database/entities/user.entity';
import CacheModule from '~/@cache/cache.module';
import { UtilModule } from '~/util/util.module';
import { AwsModule } from '~/aws/aws.module';
import { JwtModule } from '~/jwt/jwt.module';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserInfo } from '~/@database/entities/user.info.entity';

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forFeature([User, UserInfo]),
    UtilModule,
    AwsModule,
    JwtModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
