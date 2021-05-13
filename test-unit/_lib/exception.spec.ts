import { BadRequestException } from '@nestjs/common';
import { exception } from '~/_lib';

describe('lib/exception', () => {
  it('should return string type data', () => {
    // ? init variables
    const args = { loc: 'loc', msg: 'msg', error: { data: 'data' } };
    try {
      // ? run
      throw exception({ type: 'BadRequestException', ...args });
    } catch (error) {
      // ? test
      expect(error).toMatchObject(new BadRequestException(args));
    }
  });
});
