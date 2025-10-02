export class ApiError extends Error {
  public statusCode: number

  constructor(statusCode: number, message: string, name = 'Erreur interne') {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}
