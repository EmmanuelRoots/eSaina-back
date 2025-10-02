import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../../data/exception/api.exception';

export const ExceptionMiddleware = (error: any, req: Request, res: Response, next: NextFunction): Response | void => {
  // console.log(error, req.body)
  if (error) {
    try {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          statusCode: error.statusCode,
          message: error.message,
        })
      } else {
        switch (error.status) {
        case 400:
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.fields ? Object.keys(error.fields).map((key: string) => error.fields[key].message) : 'Données au mauvais format',
          })
        default:
          return res.status(error.status).json({
            success: false,
            statusCode: error.status,
            message: error.message,
          })
        }
      }
    } catch (_) {
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message,
      })
    }
  }

  next()
}
