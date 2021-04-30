import { ConfigType } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';
import appConfig from '~/@config/app.config';
import isEnv from '~/_lib/isEnv';

export default (ac: ConfigType<typeof appConfig>): GqlModuleOptions => {
  const options: GqlModuleOptions = {
    playground: !isEnv('prod'),
    debug: !isEnv('prod'),
    context: ({ req, res }) => ({ req, res }),
    installSubscriptionHandlers: true,
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 5,
    },
    introspection: isEnv('local') || isEnv('dev'),
    autoSchemaFile: join(__dirname, '..', 'schema.gql'),
    cors: {
      origin: ac.CORS_ORIGIN,
      credentials: true,
    },
  };
  return options;
};
