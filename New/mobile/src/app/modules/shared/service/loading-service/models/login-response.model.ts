export interface LoginResponse {
  authResult: string;
  domain: string;
  authMessage: string;
  clientId: string;
  clientList: any[];
  status: string;
  informationLine: string;
  timeoutInMin: number;
  myvoyaDomain: string;
  myvoyaLogoutUrl: string;
}

export interface VoyaLoginResponse {
  loginResponse: LoginResponse;
}
