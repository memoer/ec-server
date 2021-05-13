import * as bcrypt from 'bcrypt';
import { generateHash, compareHash } from '~/_lib';

describe('lib/generateHash', () => {
  jest.spyOn(bcrypt, 'hash');
  const plainString = 'test';
  let hash: string;

  it('generateHash', async () => {
    // ? run
    hash = await generateHash(plainString);
    // ? test
    expect(bcrypt.hash).toHaveBeenNthCalledWith(
      1,
      plainString,
      +process.env.HASH_SALT_OR_ROUND,
    );
    expect(hash).toEqual(expect.any(String));
  });

  it('compareHash', async () => {
    // ? run
    const result = await compareHash(plainString, hash);
    // ? test
    expect(result).toEqual(true);
  });
});
