export interface TransactionListItem {
  checkCashDate: string;
  currentStatus: string;
  PPT_PREPARE_PAYMENT: string;
  deliveryMaxDate: string;
  deliveryRange: string;
  directDepositDate: string;
  moneyOutDeliveryMethod: string;
  moneyOutSubType: string;
  moneyOutType: string;
  netCheckAmount: string;
  netCheckAmountSource: string;
  taskId: string;
  transactionDate: string;
  transactionCompletionDate: string;
  upsTrackingAvailable: string;
  upsTrackingNumber: string;
  moneyOutMessage: string;
  transactionIdentifier: string;
}

export interface Item {
  clientType: string;
  moneyoutTotalCount: string;
  moneyoutLoanCount: string;
  moneyoutWithdrawalCount: string;
  paymentStopped: string;
  moneyoutComposite: string;
  notepadAttached: null;
}

export interface Details {
  item: Item[];
  transactionList: TransactionListItem[];
  moneyOutEnabledInSetIt: boolean;
}

export interface MoneyOutPlanTransactions {
  planId: string;
  details: Details;
}

export interface MoneyOutDetailItem {
  clientId: string;
  clientPlanTransactions: MoneyOutPlanTransactions[];
}

export interface MoneyOutDetails {
  moneyOutDetailItem: MoneyOutDetailItem[];
}
