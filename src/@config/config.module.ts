import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import isEnv from '~/lib/isEnv';
import appConfig, { appValidationSchema } from './app.config';
import databaseConfig, { databaseValidationSchema } from './database.config';
import redisConfig, { redisValidationSchema } from './redis.config';

export default ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV}`,
  ignoreEnvFile: isEnv('staging') || isEnv('prod'),
  load: [appConfig, databaseConfig, redisConfig],
  validationSchema: Joi.object({
    ...appValidationSchema,
    ...databaseValidationSchema,
    ...redisValidationSchema,
  }),
  validationOptions: {
    // 환경 변수의 값이 unknown인 변수들을 허용할 것인가?
    allowUnknow: false,
    // true -> 첫 번째 validation 검사에서 멈춤
    // false -> 모두 유효성 검사를 진행하고 모든 error를 출력
    abortEarly: false,
  },
});
