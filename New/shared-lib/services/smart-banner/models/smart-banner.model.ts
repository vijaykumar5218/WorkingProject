export interface SmartBannerOptions {
  title: string;
  author: string;
  icon: string;
  'button-url-apple': string;
  'button-url-google': string;
}

export interface SmartBannerEnableConditions {
  isSmartBannerHidden: boolean;
  isSmartBannerDismissed: boolean;
}
