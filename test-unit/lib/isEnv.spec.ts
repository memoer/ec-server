import isEnv from '~/lib/isEnv';

describe('lib/isEnv', () => {
  it('test', () => {
    const result = isEnv('test');
    expect(result).toEqual(true);
  });
  it('local', () => {
    process.env.NODE_ENV = 'local';
    const result = isEnv('local');
    expect(result).toEqual(true);
  });
  it('dev', () => {
    process.env.NODE_ENV = 'dev';
    const result = isEnv('dev');
    expect(result).toEqual(true);
  });
  it('staging', () => {
    process.env.NODE_ENV = 'staging';
    const result = isEnv('staging');
    expect(result).toEqual(true);
  });
  it('prod', () => {
    process.env.NODE_ENV = 'prod';
    const result = isEnv('prod');
    expect(result).toEqual(true);
  });
  afterAll(() => {
    process.env.NODE_ENV = 'test';
  });
});
