import { NextFunction, Request, Response } from "express";

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
  if (!req.body.refreshToken) {
    return res.status(401).json({ message: 'Refresh token manquant' });
  }
  next();
}