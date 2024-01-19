export interface LeftSideContent {
  suggestedLifeEventHeader?: SuggestedLifeEventHeader;
  workplaceAccountSnapshotHeader?: string;
}
export interface SuggestedLifeEventHeader {
  journeyHeader: string;
  journeyInProgressButton?: string;
  journeyNotStartedButton?: string;
}
export interface LeftSideJSONContent {
  WorkplaceAccountSnapshotHeader?: string;
  SuggestedLifeEventHeader?: string;
}
