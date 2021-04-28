import isEnv from '~/lib/isEnv';

describe('lib/isEnv', () => {
  afterAll(() => (process.env.NODE_ENV = 'test'));

  it('test', () => {
    // ? run
    const result = isEnv('test');
    // ? test
    expect(result).toEqual(true);
  });

  it('local', () => {
    // ? variables to use & init mock
    process.env.NODE_ENV = 'local';
    // ? run
    const result = isEnv('local');
    // ? test
    expect(result).toEqual(true);
  });

  it('dev', () => {
    // ? variables to use & init mock
    process.env.NODE_ENV = 'dev';
    // ? run
    const result = isEnv('dev');
    // ? test
    expect(result).toEqual(true);
  });

  it('staging', () => {
    // ? variables to use & init mock
    process.env.NODE_ENV = 'staging';
    // ? run
    const result = isEnv('staging');
    // ? test
    expect(result).toEqual(true);
  });

  it('prod', () => {
    // ? variables to use & init mock
    process.env.NODE_ENV = 'prod';
    // ? run
    const result = isEnv('prod');
    // ? test
    expect(result).toEqual(true);
  });
});
