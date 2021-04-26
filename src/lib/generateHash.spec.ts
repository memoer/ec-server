import generateHash from './generateHash';
import * as bcrypt from 'bcrypt';

describe('lib/generateHash', () => {
  jest.spyOn(bcrypt, 'hash');

  it('should return string type data', async () => {
    // * variables to use & init mock
    const data = 'test';
    // * run
    const result = await generateHash(data);
    // * test
    expect(bcrypt.hash).toHaveBeenNthCalledWith(
      1,
      data,
      +process.env.JWT_SECRET_KEY,
    );
    expect(result).toEqual(expect.any(String));
  });
});
