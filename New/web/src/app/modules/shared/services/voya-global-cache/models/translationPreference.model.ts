export interface TranslationPreferenceResponse {
  dataStatus: string;
  translationEnabled: boolean;
  modalAlertsEnabled: boolean;
  contentCaptureEnabled: boolean;
  oneLinkKeyForEnglish: string;
  oneLinkKeyForSpanish: string;
  langPreference: {
    preference: string;
  };
  translationEnabledMyvoyageDsh: boolean;
  clientTranslationEnabled: boolean;
  clientId: string;
}
