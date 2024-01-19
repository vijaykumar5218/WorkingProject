const loginBaseUrl = 'https://login.voya.com/';
export const prodEnvironment = {
  production: true,
  baseUrl: '/',
  tokenBaseUrl: 'https://token.app.voya.com/',
  myvoyaBaseUrl: 'https://myvoya-web.voya.com/',
  loginBaseUrl: loginBaseUrl,
  myVoyaDomain: 'https://my.voya.com/',
  savviBaseUrl: 'https://myhealthwealth.voya.com/',
  tpaPrefix: '',
  tpaSdk: '1286e91c-510c-4481-9c9c-32701d4ce715',
  firebaseConfig: {
    apiKey: 'AIzaSyD5XoLfLvPuMzWuGomS7WYM3zE3Sa7jhTQ',
    authDomain: 'myvoyage-prod.firebaseapp.com',
    projectId: 'myvoyage-prod',
    storageBucket: 'myvoyage-prod.appspot.com',
    messagingSenderId: '727577719438',
    appId: '1:727577719438:web:01977249a087146c358fdf',
    measurementId: 'G-9YZ362SFHV',
  },
  qualtricsStartupUrl:
    'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
  logoutUrl:
    loginBaseUrl +
    'oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
};
