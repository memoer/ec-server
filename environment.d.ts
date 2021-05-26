declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      NODE_ENV: 'test' | 'local' | 'dev' | 'staging' | 'prod';
      JWT_PRIVATE_KEY: string;
      HASH_SALT_OR_ROUND: string;
      SENTRY_DSN: string;
      CORS_ORIGIN: string;
      CSRF_MAX_AGE: string;
      THROTTLER_TTL: string;
      THROTTLER_LIMIT: string;
      GQL_CACHE_DEFAULT_MAX_AGE: string;
      API_SECRET_KEY: string;
      //
      TYPEORM_HOST: string;
      TYPEORM_USERNAME: string;
      TYPEORM_PASSWORD: string;
      TYPEORM_DATABASE: string;
      TYPEORM_PORT: string;
      TYPEORM_CACHE_TTL: string;
      //
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_SMS_REGION: string;
      AWS_SNS_REGION: string;
      AWS_S3_REGION: string;
      AWS_SNS_FROM: string;
      AWS_BUCKET: string;
      //
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
