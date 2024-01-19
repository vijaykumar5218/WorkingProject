export interface TransactionHistory {
  tradeDate: string;
  type: string;
  tranCode: string;
  cash: number;
  clientId: string;
  planId: string;
  participantId: string;
  unit_or_unshrs: string;
  br140_new_val_cash: string;
  br161_shr_price: string;
  br009_run_date: string;
  br011_seq_num: string;
  br980_ACT_NAME: string;
  br172_vouch_num: string;
  isHSATransaction?: boolean;
  hsaTransactionData?: HSATransaction;
}

export interface RootObject {
  transactionHistories: TransactionHistory[];
}

export interface HSATransaction {
  HAS_PARTY_ID: string;
  Plan_ID: number;
  Transaction_Date: string;
  Transaction_Code: string;
  Transaction_Description: string;
  Transaction_Amt: number;
  Provider_Name: string;
  Claim_Number: string;
  Service_Recipient: string;
  Create_Date: string;
}

export interface HSATransactionsRoot {
  Status: string;
  AllAccountsTransactions: HSATransaction[];
}
