import * as bcrypt from 'bcrypt';
import { generateHash } from '~/_lib/hash';

describe('lib/generateHash', () => {
  jest.spyOn(bcrypt, 'hash');

  it('should return string type data', async () => {
    // ? variables to use & init mock
    const data = 'test';
    // ? run
    const result = await generateHash(data);
    // ? test
    expect(bcrypt.hash).toHaveBeenNthCalledWith(
      1,
      data,
      +process.env.JWT_PRIVATE_KEY,
    );
    expect(result).toEqual(expect.any(String));
  });
});
