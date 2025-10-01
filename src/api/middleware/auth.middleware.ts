import { NextFunction, Request, Response } from 'express';
import { verifyAccess } from '../../utils/jwt';

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */

export const  authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const hdr = req.headers.authorization
  if (!hdr) return res.status(401).json({ message: 'Missing token' });

  try {
    const token = hdr.split(' ')[1];
    const payload = verifyAccess(token);   //jeton expiré ? jwt jette une erreur
    (req as Request).body = payload.user;
    next();
  } catch (err) {
    
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}