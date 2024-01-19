export interface SettingsPreferences {
  lastPreferenceResponse?: boolean;
  required?: boolean;
  primaryEmail?: {
    lastUpdatedDate?: Date;
    partyContactId: string;
    email: string;
    lastFailedInd: string;
  };
  secondaryEmailAllowed?: boolean;
  docDeliveryEmailContactId?: string;
  mobilePhone?: {
    lastUpdatedDate?: Date;
    partyContactId?: string;
    phoneNumber?: string;
  };
  insightsNotificationPrefs?: {
    prefPushNotificationContactId?: string;
    prefMobileContactId?: string;
    prefEmailContactId?: string;
  };
  highPrioitytNotificationPrefs?: {
    prefPushNotificationContactId?: string;
    prefMobileContactId?: string;
    prefEmailContactId?: string;
  };
  accountAlertPrefs?: {
    prefPushNotificationContactId?: string;
    prefMobileContactId?: string;
    prefEmailContactId?: string;
  };
}
