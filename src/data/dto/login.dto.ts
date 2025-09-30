export default interface LoginDTO {
  email: string
  password: string
}

export enum mfaProvider {
  GOOGLE = 'google'
}

export interface mfaDTO{
  accessToken:string,
  provider:mfaProvider
}