export interface JourneyContent {
  landingPage: {
    navHeader: string;
    header: string;
    desc: string;
    descPoints?: Array<string>;
    allJourneysHeader: string;
    recommendedJourneysHeader: string;
    myjourneys: string;
    comingSoonAltText: string;
  };
  tabHeader: {
    overviewLabel: string;
    stepsLabel: string;
    resourcesLabel: string;
  };
  webviewClose: string;
  videoClose: string;
  resourcesExpandLabel: string;
  resourcesCloseLabel: string;
  overviewDoneButton: string;
  overviewRevisitButton: string;
  backButton: string;
  selectPlaceholder: string;
}
