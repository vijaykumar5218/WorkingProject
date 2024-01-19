export interface Content {
  widgetItems: WidgetItem[];
  accountsHeader: string;
  coveragesHeader: string;
  coverageWidgetItems: WidgetItem[];
  viewNetWorth: string;
  cancelLink: string;
  netWorth: string;
  manageAccounts: string;
  nonMxTempText: string;
}

export interface WidgetItem {
  text: string;
  value: string;
  widgetButtonText: string;
}
