import { UserProvider } from '~/user/entity';
import { CallbackOutputData } from '../dto/callback.dto';

export function getAuthEnv(strategyName: Exclude<UserProvider, 'LOCAL'>) {
  return {
    clientID: process.env[`${strategyName}_CLIENT_ID`],
    clientSecret: process.env[`${strategyName}_SECRET_KEY`],
    callbackURL: process.env[`${strategyName}_CALLBACK_URL`],
    ...(strategyName === UserProvider.GOOGLE && {
      scope: ['email', 'profile'],
    }),
  };
}
export function commonValidate(
  _: string,
  __: string,
  { provider, id }: CallbackOutputData,
  done: any,
): any {
  done(null, {
    id,
    provider,
  });
}
