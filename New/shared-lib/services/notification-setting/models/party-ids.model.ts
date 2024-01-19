export interface PartyIds {
  emailContactId?: string;
  mobileContactId?: string;
  HPPrefPushContactId?: string;
  HPPrefMobileContactId?: string;
  HPPrefEmailContactId?: string;
  AAPrefPushContactId?: string;
  AAPrefMobileContactId?: string;
  AAPrefEmailContactId?: string;
  INPrefPushContactId?: string;
  INPrefMobileContactId?: string;
  INPrefEmailContactId?: string;
}

export interface SectionChecked {
  pushChecked: boolean;
  emailChecked: boolean;
  textChecked: boolean;
  sectionActive: boolean;
  textDisabled: boolean;
}
