export interface NoBenefit {
  noBenefitIcons: [];
  header: string;
}

export interface NoBenefitContent {
  NoBenefitsText: string;
  workplaceCovergeNoBenefits: string;
  Insights_OverlayMessage_ReviewAuthorization: string;
  Insights_ClaimsAuthorization_ReadDisclosure: string;
  Insights_TurnOffClaimsAuthorization: string;
  INSIGHTS_PreventativeCancerScreening_Breast: string;
  INSIGHTS_PreventativeCancerScreening_Cervical: string;
  INSIGHTS_PreventativeCancerScreening_Colorectal: string;
  Insights_ManageMyHealthandWealth: string;
  workplaceCovergePreAuthMessage: string;
  workplaceCovergeMedicalSpending: string;
  TotalHealthSpending_Disclaimer: string;
  TotalHealthSpend_DisclaimerTile: string;
  Insights_TPA_PendingClaimsAccess: string;
  workplacedashboardTile?: string;
  HSA_FSA_Store_Disclosure_Modal: string;
  workplaceCovergeTPAWaitingMessage?: string;
  Insights_ThankYouforAuth_Banner: string;
  Insights_BSTsmartcard_Nudge: string;
}

export interface BSTSmartCardContent {
  show?: boolean;
  name: string;
  header_img: string;
  header: string;
  body: string;
  body_img: string;
  link_text: string;
  modalContent: {
    modalHeader: string;
    topHeader: string;
    topBody: string;
    topImage: string;
    bodyParts: [
      {
        header: string;
        body: string;
      }
    ];
  };
}

export interface PrevCareContent {
  title: string;
  title_img_url: string;
  title_img_alt: string;
  body: string;
  body_img_url: string;
  body_img_alt: string;
  footer_text: string;
}

export interface WorkplaceCovergeNoBenefits {
  noBenefitDescription: string;
  noBenefitHeader: string;
}

export interface NotificationContent {
  AggregateAccountsMSG: string;
  ComeBackMSG: string;
  FinishJourneyMSG: string;
  Insights_TotalHealthSpend_tileMessage_NoDataAvailable: string;
  OpenEnrollmentMSG: string;
}
