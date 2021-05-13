import { GraphQLModule as GraphQLM } from '@nestjs/graphql';
import { appConfig } from '~/@config/register';
import { ConfigModule } from '~/@config/config.module';
import graphqlFactory from './graphql.factory';

export const GraphQLModule = GraphQLM.forRootAsync({
  imports: [ConfigModule],
  useFactory: graphqlFactory,
  inject: [appConfig.KEY],
});
