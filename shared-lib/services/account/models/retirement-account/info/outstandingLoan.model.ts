export interface OutstandingLoan {
  outstandingLoan: {
    allLoanCount: number;
    defaultedLoanBal: number;
    defaultedLoanCount: number;
    defaultedIntArrears: number;
    genLoanCount: number;
    eligEarlyPayoff: boolean;
    outstandLoanCount: number;
    resLoanCount: number;
    hardshipLoanCount: number;
    totLoanBal: number;
    totLoanPayment: number;
    totLoanPrincipal: number;
    monthlyAchPaymentCount: number;
    outstandingLoanDtls: OutstandingLoanDtls[];
  };
}

export interface RootObject {
  outstandingLoan: OutstandingLoan;
}

export interface OutstandingLoanDtls {
  loanNumber: number;
  balance: number;
}
