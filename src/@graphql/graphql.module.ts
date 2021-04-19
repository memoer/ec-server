import { GraphQLModule } from '@nestjs/graphql';
import ConfigModule from '../@config/config.module';
import appConfig from '../@config/app.config';
import graphqlFactory from './graphql.factory';

export default GraphQLModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: graphqlFactory,
  inject: [appConfig.KEY],
});
