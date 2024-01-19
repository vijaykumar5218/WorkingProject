export interface GoogleAnalytics {
  gaData: {
    powerUserId?: string;
    sessionId: string;
    userId: string;
    appId: string;
    rsDomain: string;
  };
}
export interface GAObject {
  eventCategory: string;
  eventAction: string;
  eventLabel: string;
  eventActionCustom: string;
  eventCategoryCustom: string;
  eventLabelCustom: string;
  eventDetail: string;
  sessionId: string;
  page_location: string;
}
