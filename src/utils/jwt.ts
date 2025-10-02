import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms'

import { UserDTO } from '../data/dto/user.dto';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL as ms.StringValue || '5m'; // 5 min par défaut

export const signAccess = (user: UserDTO): string => {

  return jwt.sign({ user },ACCESS_SECRET,{algorithm:'HS256',expiresIn:ACCESS_TTL});
}
  

export const verifyAccess = (token: string): { user: UserDTO } =>
  jwt.verify(token, ACCESS_SECRET) as { user: UserDTO };