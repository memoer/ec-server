import * as bcrypt from 'bcrypt';

export default (data: any) =>
  bcrypt.hash(data, Number(process.env.JWT_SECRET_KEY));
