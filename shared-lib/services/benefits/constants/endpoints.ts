const contextRoot = 'myvoyage/ws/ers/';
const contextMedicalRoot = 'myvoyage/health/savvi/owcc/';
export const endPoints = {
  benefits: 'myvoyage/health/savvi/plan/benefits',
  benefitIcons: contextRoot + 'content/section/benefitssummary',
  noBenefitContent: contextRoot + 'content/section/coverages',
  noHealthData: contextRoot + 'content/section/notifications',
  benefitModals: contextRoot + 'content/section/benefitsselection',
  messages: contextRoot + 'content/section/messages',
  benefitsEnrollment: 'myvoyage/health/savvi/benefits/enrollment',
  spendingDetails: 'myvoyage/bst/healthUtlization',
  annualHealthCheckup: 'myvoyage/bst/annualHealthCheckup',
  guidanceEnabled: 'myvoyage/health/savvi/enabled',
  savePageVisit: contextRoot + 'service/savePageVisit',
  getSelectionValues: 'myvoyage/bst/selectionValues',
  getMyIdCard: contextMedicalRoot + 'getMedicalCard/$cardSide/$planId',
  addMedicalCard: contextMedicalRoot + 'addMedicalCard',
  updateMedicalCard: contextMedicalRoot + 'updateMedicalCard',
  deleteMedicalCard: contextMedicalRoot + 'deleteMedicalCard',
  bstSmartCards: 'myvoyage/bst/smartCardNudge',
  benefitForBenefitshub: contextRoot+'service/mybenefitshub/getbenefitsandcoverages',
};

export const tokenEndPoints = {
  samlAuthToken: 'oidcop/sps/oauth/oauth20/token',
};

export const loginEndPoints = {
  savviSaml: `saml/sps/saml-idp-my-to-guidance/saml20/logininitial?PartnerId={savviBaseUrl}v1/auth/saml2/voya&access_token=`,
};
