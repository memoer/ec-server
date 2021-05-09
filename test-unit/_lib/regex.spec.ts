import { passwordRegex } from '~/_lib/regex';

describe('regex', () => {
  it('password regex test', () => {
    // ? init variables
    const valid = passwordRegex.test('Abcdefg12345#');
    const invalid = passwordRegex.test('abcdefg12345');
    // ? test
    expect(valid).toEqual(true);
    expect(invalid).toEqual(false);
  });
});
