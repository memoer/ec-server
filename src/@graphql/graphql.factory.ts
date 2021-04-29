import { ConfigType } from '@nestjs/config';
import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';
import appConfig from '~/@config/app.config';
import isEnv from '~/_lib/isEnv';

export default async (
  ac: ConfigType<typeof appConfig>,
): Promise<GqlModuleOptions> => {
  const options: GqlModuleOptions = {
    playground: !isEnv('prod'),
    debug: !isEnv('prod'),
    // throttler 사용하려면 res까지 리턴해야 한다.
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
