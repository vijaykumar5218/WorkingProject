export interface MbhDashboardConent {
  billingandpayments?: string;
  benefitsandcoverages?: string;
}

export interface BillingPaymentsContent {
  header?: string;
  info?: BillingPaymentsContentInfo;
}

interface BillingPaymentsContentInfo {
  message?: string;
  isShowAlertIcon?: boolean;
  linkName?: string;
  linkURL?: string;
}
