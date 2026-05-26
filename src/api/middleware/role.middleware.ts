import { NextFunction, Request, Response } from 'express'

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Note: the user object in token might not have the role name directly 
    // depending on what was signed in signAccess.
    // Let's check signAccess in jwt.ts.
    
    if (!user.role || !allowedRoles.includes(user.role.name)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' })
    }

    next()
  }
}
