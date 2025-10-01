export default interface LoginDTO {
  email: string
  password: string
  deviceInfo? : string
}

export enum mfaProvider {
  GOOGLE = 'google'
}

export interface mfaDTO{
  accessToken:string,
  provider:mfaProvider
}