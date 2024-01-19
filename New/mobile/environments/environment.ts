// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  livereload: true,
  baseUrl: 'https://myvoyage.intg.app.voya.com/',
  tpaPrefix: 'INTG-',
  tpaSdk: '1a1d68b8-93c1-41ac-bced-16d1624c527f',
  tokenBaseUrl: 'https://token.intg.app.voya.com/',
  myvoyaBaseUrl: 'https://myvoya.intg.app.voya.com/',
  loginBaseUrl: 'https://login.intg.voya.com/',
  savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
  authClientID: 'myvoyage_app_MFbT3mcQsSY78eugY5je',
  authTokenExchangeClient: 'myvoyage_app_token_exchange_8ah5YTB3MIavGzS3UXjj',
  ssoSamlUrl: 'https://sso.myvoya.com',
  openIdConfigurationUrl: 'oidcop/app/.well-known/openid-configuration',
  samlAudience: 'saml/sps/saml-idp-login/saml20',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
