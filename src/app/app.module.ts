import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from '~/_lib';
import { CacheModule } from '~/@cache/cache.module';
import { ConfigModule } from '~/@config/config.module';
import { DBModule } from '~/@database/db.module';
import { GraphQLModule } from '~/@graphql/graphql.module';
import { AwsModule } from '~/aws/aws.module';
import { JwtService } from '~/jwt/jwt.service';
import { UserModule } from '~/user/user.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { OAuthModule } from '~/oauth/oauth.module';

@Module({
  imports: [
    CacheModule,
    ConfigModule,
    DBModule,
    GraphQLModule,
    AwsModule,
    JwtService,
    UserModule,
    OAuthModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
