export interface BalanceHistoryGraph {
  portfolioBalanceHistory?: BalanceHistory[];
  years?: string[];
  portfolioBalHistText?: string;
}

export interface BalanceHistory {
  planName?: string;
  planId?: string;
  amounts?: string[];
}
