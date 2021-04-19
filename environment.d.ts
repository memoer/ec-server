declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'test' | 'local' | 'dev' | 'staging' | 'prod';
      JWT_SECRET_KEY: string;
      SENTRY_DSN: string;
      THROTTLER_TTL: string;
      THROTTLER_LIMIT: string;
      CORS_ORIGIN: string;
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
      //
      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
