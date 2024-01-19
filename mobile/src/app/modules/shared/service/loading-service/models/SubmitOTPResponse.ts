export interface SubmitOTPResponse {
  exceptionMsg?: string;
  location?: string;
  state?: string;
  message?: string;
  mechanism?: string;
  stateId?: string;
  otp_user_otp_hint?: string;
  otp_user_sentTo?: string;
  mappingRuleData?: string;
  s?: string;
  emailAddress?: string;
  d?: string;
  url?: string;
}
