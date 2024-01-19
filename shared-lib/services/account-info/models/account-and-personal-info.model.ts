export interface AccountRecovery {
  login: {
    userName: string;
    passwordLastChangedDate: string;
    canEditInfo: boolean;
  };
  security: {
    accountRecoveryInfo: {
      primaryRecoveryMethod: string;
      mobile: string;
      email: string;
    };
    additionalLinks: any;
  };
}

export interface AccountInfoText {
  heading: string;
  name: string;
  email: string;
  phone: string;
  loginInfo: string;
  loginInfoDesc: string;
  retrieveTextEmail: string;
  retrieveTextMobile: string;
  emailErrorMsg: string;
  nameTitle: string;
  emailTitle: string;
  phoneTitle: string;
  phoneSubTitle: string;
  invalidEmail: string;
  invalidPhone: string;
  invalidDisplayName: string;
}
export interface PasswordResponse {
  password: string;
  newPassword: string;
  confirmPassword: string;
  newUsername: string;
}

export interface MoreDescription {
  HealthCoachHeader?: string;
  AccountRecoveryDisclosure?: string;
  TimetapURL?: string;
  WealthCoachHeader?: string;
  HealthCoachDesc?: string;
  ContactCoachDisclosure?: string;
  WealthCoachDesc?: string;
  HelpPageJSON?: string;
  UnregisterDeviceText?: string;
  WealthCoachStatementText?: string;
  DesktopHelpPageFAQs?: string;
}

export interface UnregisterMessage {
  message: Array<string>;
}
export interface PersonalInfoTab {
  tabslabel: {
    persionalInfo: string;
    accountInfo: string;
  };
}
