import * as bcrypt from 'bcrypt';

export default (data: any) =>
  bcrypt.hash(data, +process.env.HASH_SALT_OR_ROUND);
