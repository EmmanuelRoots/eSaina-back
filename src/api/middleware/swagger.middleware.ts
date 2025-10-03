// src/middleware/tsoa-authentication.ts
import * as express from 'express';
import { verifyAccess } from '../../utils/jwt';

export async function expressAuthentication(
  req: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName !== 'bearer') throw new Error('Unknown security');

  const hdr = req.headers.authorization;
  if (!hdr) throw new Error('Missing token');

  const token = hdr.split(' ')[1];
  const payload = verifyAccess(token);
  
  return payload.user;                 
}