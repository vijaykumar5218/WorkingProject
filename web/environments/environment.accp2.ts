const loginBaseUrl = 'https://login4.accp.voya.com/';
export const accpEnvironment2 = {
  production: true,
  baseUrl: '/',
  tokenBaseUrl: 'https://token.accp.app.voya.com/',
  myvoyaBaseUrl: 'https://myvoya-web-my4.accp.voya.com/',
  loginBaseUrl: loginBaseUrl,
  myVoyaDomain: 'https://my4.accp.voya.com/',
  savviBaseUrl: 'https://myhealthwealth.accp.voya.com/',
  tpaPrefix: 'ACCP-',
  tpaSdk: '1a1d68b8-93c1-41ac-bced-16d1624c527f',
  firebaseConfig: {
    apiKey: 'AIzaSyAfQz2yCIb0fUtU4V3scCfmLNJaSfNxNoE',
    authDomain: 'myvoyage-accp.firebaseapp.com',
    projectId: 'myvoyage-accp',
    storageBucket: 'myvoyage-accp.appspot.com',
    messagingSenderId: '35758309019',
    appId: '1:35758309019:web:0f2580657b1a8988afd03e',
    measurementId: 'G-R7STRCSL1P',
  },
  qualtricsStartupUrl:
    'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
  logoutUrl:
    loginBaseUrl +
    'oidcop/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:oidc_logout&oidc_op=oidc_op_voya_customer_web',
};
