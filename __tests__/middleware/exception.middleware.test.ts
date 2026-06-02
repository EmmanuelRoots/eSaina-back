/**
 * Tests unitaires — exception.middleware.ts
 *
 * Vérifie : formatage des ApiError, des erreurs de validation TSOA (400),
 * des erreurs génériques, et la réponse 500 de secours.
 */
import { Request, Response, NextFunction } from 'express'
import { ExceptionMiddleware } from '../../src/api/middleware/exception.middleware'
import { ApiError } from '../../src/data/exception/api.exception'

const buildRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response)

const req = {} as Request
const next = jest.fn() as NextFunction

describe('ExceptionMiddleware', () => {
  beforeEach(() => jest.clearAllMocks())

  it('formate correctement une ApiError', () => {
    const res = buildRes()
    const err = new ApiError(404, 'Resource not found', 'not_found')

    ExceptionMiddleware(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      statusCode: 404,
      message: 'Resource not found',
    })
  })

  it('formate les erreurs de validation TSOA (status 400 avec fields)', () => {
    const res = buildRes()
    const err = {
      status: 400,
      fields: {
        email: { message: 'Email invalide' },
        password: { message: 'Mot de passe trop court' },
      },
    }

    ExceptionMiddleware(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    const jsonArg = (res.json as jest.Mock).mock.calls[0][0]
    expect(jsonArg.success).toBe(false)
    expect(jsonArg.message).toContain('Email invalide')
    expect(jsonArg.message).toContain('Mot de passe trop court')
  })

  it('formate les erreurs TSOA sans fields', () => {
    const res = buildRes()
    const err = { status: 400, message: 'Bad request' }

    ExceptionMiddleware(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, statusCode: 400 })
    )
  })

  it('formate les erreurs avec status arbitraire (403, 500…)', () => {
    const res = buildRes()
    const err = { status: 403, message: 'Forbidden' }

    ExceptionMiddleware(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('renvoie 500 en cas d\'erreur pendant le traitement', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      // json lève une erreur au premier appel
      json: jest.fn().mockImplementationOnce(() => { throw new Error('crash') }).mockReturnThis(),
    } as unknown as Response
    const err = new ApiError(400, 'test')

    ExceptionMiddleware(err, req, res, next)

    expect(res.status).toHaveBeenLastCalledWith(500)
  })

  it('appelle next() si aucune erreur n\'est fournie', () => {
    const res = buildRes()

    ExceptionMiddleware(null, req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})
