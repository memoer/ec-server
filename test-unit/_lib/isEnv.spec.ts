import isEnv from '~/_lib/isEnv';

describe('lib/isEnv', () => {
  afterAll(() => (process.env.NODE_ENV = 'test'));

  it('test', () => {
    // ? run
    const result = isEnv('test');
    // ? test
    expect(result).toEqual(true);
  });

  it('local', () => {
    // ? init variables
    process.env.NODE_ENV = 'local';
    // ? run
    const result = isEnv('local');
    // ? test
    expect(result).toEqual(true);
  });

  it('dev', () => {
    // ? init variables
    process.env.NODE_ENV = 'dev';
    // ? run
    const result = isEnv('dev');
    // ? test
    expect(result).toEqual(true);
  });

  it('staging', () => {
    // ? init variables
    process.env.NODE_ENV = 'staging';
    // ? run
    const result = isEnv('staging');
    // ? test
    expect(result).toEqual(true);
  });

  it('prod', () => {
    // ? init variables
    process.env.NODE_ENV = 'prod';
    // ? run
    const result = isEnv('prod');
    // ? test
    expect(result).toEqual(true);
  });
});
