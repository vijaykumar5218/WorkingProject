const loginBaseUrl = 'https://login4.unit.voya.com/';
export const unitEnvironment2 = {
  production: true,
  baseUrl: '/',
  tokenBaseUrl: 'https://token.unit.app.voya.com/',
  myvoyaBaseUrl: 'https://myvoya-web.unit.voya.com/',
  loginBaseUrl: loginBaseUrl,
  myVoyaDomain: 'https://my3.unit.voya.com/',
  savviBaseUrl: 'https://myhealthwealth.unit.voya.com/',
  tpaPrefix: 'UNIT-',
  tpaSdk: '1a1d68b8-93c1-41ac-bced-16d1624c527f',
  firebaseConfig: {
    apiKey: 'AIzaSyA1rqtineGMBei3LKwgbvAj80YSXB7mSDw',
    authDomain: 'myvoyage-intg.firebaseapp.com',
    projectId: 'myvoyage-intg',
    storageBucket: 'myvoyage-intg.appspot.com',
    messagingSenderId: '143111284908',
    appId: '1:143111284908:web:0773ef5d5b027651dc1709',
    measurementId: 'G-SKZE188BBR',
  },
  qualtricsStartupUrl:
    'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
  logoutUrl:
    loginBaseUrl +
    'oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
};
