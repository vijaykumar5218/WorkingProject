import {ProgressBarStep} from '@shared-lib/components/step-progress-bar/models/step-progress-bar-model';

export interface AllLaunchContent {
  LoginNoAccessMessage: string;
  loginJSON: string;
  AppVersionJSON: string;
}

export interface LaunchContent {
  MobileLaunchContent: LaunchContentPage[];
}

export interface LaunchContentPage extends ProgressBarStep {
  login_description: {
    description: string;
    image_url: string;
    link_name: string;
    link_url: string;
  };
  login_section: string;
  login_title: string;
}

export interface NoAccessMessage {
  message_1: string;
  message_2: string;
}

export interface VersionAlertContent {
  downloadText: string;
  alertText: string;
  iosAppUrl: string;
  androidAppUrl: string;
  minVersion: number;
}

export interface PreferencesContent {
  header: string;
  subHeader: string;
  notnowButton: string;
  saveButton: string;
  preferenceOptions: PreferenceOption;
  legalText: string;
}

export interface PreferenceOption {
  'Push Notifications': boolean;
  Text: boolean;
  Email: boolean;
}
