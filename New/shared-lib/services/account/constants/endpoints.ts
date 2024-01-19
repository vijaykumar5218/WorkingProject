import {dummyPartyID} from '@shared-lib/constants/dummy';

const contextRoot = 'myvoyage/ws/ers/';
const myVoyaCtxRoot = 'myvoya/ws/ers/';

//Accounts endpoints
export const endPoints = {
  allAccounts: contextRoot + 'service/all/accounts?s=',
  aggregatedAccounts: contextRoot + 'dashboard/accounts?s=',
  participantData: contextRoot + `emvdata/profile`,
  vestedBalance: contextRoot + 'rsdata/balance/vested/',
  gainLoss: contextRoot + 'participation/history/balancehistory/',
  loan: contextRoot + 'rsdata/loans/outstanding/',
  rateOfReturn: contextRoot + 'participation/history/prr/',
  planAdviceStatus: contextRoot + 'rsdata/aboutme/plans/advicestatus',
  omEligibility: contextRoot + `orangemoney/omElig`,
  getrrinfo: contextRoot + `orangemoney/data/getrrinfo?{clientId}{sessionId}`,
  getOmEmployerMatch:
    contextRoot +
    `orangemoney/employerContribution?clientId={clientId}&planId={planId}&s={sessionId}`,
  getpension: contextRoot + `orangemoney/data/getpension?{clientId}{sessionId}`,
  getsrbenefits:
    contextRoot + `orangemoney/data/getsrbenefits?{clientId}{sessionId}`,
  getssbenefits:
    contextRoot + `orangemoney/data/getssbenefits?{clientId}{sessionId}`,
  updateOptOut:
    myVoyaCtxRoot + `service/customers/${dummyPartyID}/orangemoney/optout`,
  saveMadlib:
    myVoyaCtxRoot + `service/customers/${dummyPartyID}/orangemoney/savemadlib`,
  contribution: contextRoot + 'participation/history/contributions/',
  ytdcontribution: contextRoot + 'contrib/paycontrib/',
  employersmatch: contextRoot + 'display/message/employermatch/',
  dividend: contextRoot + 'participation/history/dividend/',
  saveRetirementAgeNonFE:
    myVoyaCtxRoot + `service/customers/${dummyPartyID}/orangemoney/validate`,
  saveRetirementAgeFE:
    myVoyaCtxRoot + `service/customers/${dummyPartyID}/orangemoney/fevalidate`,
  saveSalaryFE:
    myVoyaCtxRoot +
    `service/customers/${dummyPartyID}/orangemoney/feshowmeimpact`,
  saveSalaryNonFE:
    myVoyaCtxRoot + `service/customers/${dummyPartyID}/orangemoney/saveprofile`,
  transaction: contextRoot + 'participation/history/transactions/',
  externalLinks:
    contextRoot +
    `service/navlinks/{client}/{planID}?s={sessionID}&domain={domain}`,
  eventTracking: contextRoot + 'service/eventTracking',
  predictiveMessage: contextRoot + 'content/section/messages',
  getOfferCode: contextRoot + 'rsdata/accordion?s=',
  allHSAAccounts: 'myvoyage/wex/accountBalances?s=',
  hsaTransactions: 'myvoyage/wex/accountTransactions/',
  accountsContent: contextRoot + 'content/section/accounts',
  subscriberKey: contextRoot + 'service/sfmcUserInfo',
  balancehistory: contextRoot + 'service/portfolioBalanceHistory',
  moneyOut: contextRoot + 'service/moneyouttranscations?s=',
};

export const loginEndpoints = {
  authService:
    'mga/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:login_access_token_querystring&access_token=[exchanged_access_token]&URL=',
};
