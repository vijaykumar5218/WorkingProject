import {FirebaseOptions} from '@angular/fire/app';

export interface Environment {
  production?: boolean;
  baseUrl?: string;
  livereload?: boolean;
  tpaPrefix?: string;
  tpaSdk?: string;
  tokenBaseUrl?: string;
  myvoyaBaseUrl?: string;
  myVoyaDomain?: string;
  loginBaseUrl?: string;
  savviBaseUrl?: string;
  authClientID?: string;
  authTokenExchangeClient?: string;
  ssoSamlUrl?: string;
  qualtricsStartupUrl?: string;
  firebaseConfig?: FirebaseOptions;
  logoutUrl?: string;
  openIdConfigurationUrl?: string;
  samlAudience?: string;
}
