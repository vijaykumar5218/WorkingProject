export interface EventTrackingConstants {
  eventTrackingLogin: {
    eventName: string;
  };
  eventTrackingPreference: {
    eventName: string;
  };
  eventTrackingMx: {
    eventName: string;
    updateInd?: string;
  };
}
export interface EventTrackingEvent {
  eventName: string;
  createdBy?: string;
  updateInd?: string;
  journeyID?: number;
  journeyName?: string;
  subscriberKey?: string;
  passThruAttributes?: {attributeName: string; attributeValue: string}[];
}

export interface SFMCUserInfo {
  subscriberKey: string;
}
