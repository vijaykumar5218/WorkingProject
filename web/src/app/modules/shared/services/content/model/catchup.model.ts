export interface CatchUpJSONContent {
  workplacecatchup: string;
}
export interface CatchUpMessageHub {
  catchUp: CatchUp[];
  highPriority?: CatchUp[];
  recent?: CatchUp[];
}
export interface CatchUpContent {
  catchupHeader: string;
  catchupViewallButton: string;
  catchupReadmoreButton?: string;
  catchupBackButton?: string;
  noCatchUpText: string;
  messageCenter?: MessageCenter;
}

interface MessageCenter {
  header: string;
  highPriorityMsgTxt: string;
  newMsgTxt: string;
  recentMsgTxt: string;
}

export interface CatchUp {
  eventName: string;
  Category_name: string;
  Title: string;
  Description: string;
  Link_name: string;
  Link_url: string;
  eventStartDt: string;
  eventEndDt: string;
  eventAge: string;
  shortDescription?: string;
}
