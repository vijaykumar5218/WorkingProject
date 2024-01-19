export interface AuthBodyResult {
  authenticated: boolean;
}

export interface AuthResult {
  body?: AuthBodyResult;
  status?: number;
}
