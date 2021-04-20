import { GraphQLModule } from '@nestjs/graphql';
import ConfigModule from '~/@config/config.module';
import graphqlFactory from './graphql.factory';

export default GraphQLModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: graphqlFactory,
});
