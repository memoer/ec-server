import { ConfigType } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';
import appConfig from 'src/@config/app.config';
import isEnv from 'src/lib/isEnv';

export default (ac: ConfigType<typeof appConfig>): GqlModuleOptions => {
  const options: GqlModuleOptions = {
    playground: !isEnv('prod'),
    debug: !isEnv('prod'),
    context: ({ req }) => ({ req }),
    installSubscriptionHandlers: true,
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 5,
    },
    introspection: !isEnv('prod') || !isEnv('staging'),
    autoSchemaFile: join(__dirname, '..', 'schema.gql'),
    cors: {
      origin: ac.CORS_ORIGIN,
      credentials: true,
    },
  };
  return options;
};
