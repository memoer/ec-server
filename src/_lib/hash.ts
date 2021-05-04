import * as bcrypt from 'bcrypt';

export const generateHash = (data: any) =>
  bcrypt.hash(data, +process.env.HASH_SALT_OR_ROUND);

export const compareHash = (data: any, encrypted: string) =>
  bcrypt.compare(data, encrypted);
