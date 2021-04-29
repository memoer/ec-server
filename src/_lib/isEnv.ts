export default (env: 'test' | 'local' | 'dev' | 'staging' | 'prod') =>
  process.env.NODE_ENV === env;
