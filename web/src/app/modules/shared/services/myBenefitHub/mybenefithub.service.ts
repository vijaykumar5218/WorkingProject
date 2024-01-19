import {Injectable} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {
  BillingAccount,
  BillingAccounts,
  BillingAndPayment,
  BillingConfigs,
  PaymentDueDetails,
} from './model/billingAndPayment';
import {
  concatMap,
  from,
  Observable,
  of,
  ReplaySubject,
  Subscription,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MyBenefitHubService {
  billingdetails$: Observable<BillingAndPayment[]>;
  billingdetailsSubject: ReplaySubject<BillingAndPayment[]>;
  endPoints;
  private billingConfigActiveStatus = 'Active - In-Force';
  private nfoStatuses: string[] = [
    'Reduced Paid Up (NFO)',
    'Extended Term (NFO)',
  ];
  private autoPayIndicator = 'ACH Initiate';
  private subscription: Subscription = new Subscription();

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.billingdetailsSubject = new ReplaySubject(1);
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  getBillingAndPaymentDetails(
    refresh = false
  ): Observable<BillingAndPayment[]> {
    if (!this.billingdetails$ || refresh) {
      this.billingdetails$ = from(
        this.baseService.get(this.endPoints.getbillingdetails)
      );
      const subscription = this.billingdetails$.subscribe(
        (data: BillingAndPayment[]) => {
          this.billingdetailsSubject.next(data);
        }
      );
      this.subscription.add(subscription);
    }
    return this.billingdetailsSubject;
  }

  fetchBillingAccounts(): Observable<BillingAccounts> {
    return this.getBillingAndPaymentDetails().pipe(
      concatMap((billingAndPayments: BillingAndPayment[]) => {
        const result: BillingAccounts = {billingAccounts: []};
        if (billingAndPayments && billingAndPayments.length > 0) {
          billingAndPayments.forEach(
            (data: BillingAndPayment, index: number) => {
              const account: any = {};
              account.financialAccountId = data.financialAccountId;
              account.balance = parseFloat(data.balance);
              account.billingConfigs = this.findCurrentBillingConfig(
                billingAndPayments[index].billingConfigs
              );
              account.totalSuspense = data.totalSuspense;
              result.billingAccounts.push(account);
            }
          );
        }
        return of(result);
      })
    );
  }

  private findCurrentBillingConfig(
    billingConfigDTOs: BillingConfigs[]
  ): BillingConfigs {
    /*The current billing config should have a status of 'Active In-force' and no termination date.*/
    const activeConfigs = billingConfigDTOs.filter(
      bc => bc.status == this.billingConfigActiveStatus
    );
    const activeConfig = activeConfigs.find(bc => !bc.terminationDate);
    return activeConfig ? activeConfig : billingConfigDTOs[0];
  }

  allAccountsHaveNonforfeitureOptionStatus(): Observable<boolean> {
    return this.fetchBillingAccounts().pipe(
      concatMap((data: BillingAccounts) => {
        let result: boolean;
        if (!data.billingAccounts.length) {
          result = false;
        } else {
          const financialAccountIds = [];
          data.billingAccounts.forEach((account: BillingAccount) => {
            if (
              this.nfoStatuses.findIndex(
                s => s == account.billingConfigs.surrenderStatus
              ) === -1
            ) {
              financialAccountIds.push(account.financialAccountId);
            }
          });
          if (financialAccountIds.length > 0) {
            result = true;
          }
        }
        return of(result);
      })
    );
  }

  hasNonAutoPay(data: BillingAccounts): boolean {
    const nonAutoPayIx = data.billingAccounts.findIndex(
      a =>
        a.billingConfigs.paymentFormat !== this.autoPayIndicator &&
        this.nfoStatuses.findIndex(
          s => s == a.billingConfigs.surrenderStatus
        ) === -1
    );
    return nonAutoPayIx > -1;
  }

  setPaymentDueDetails(data: BillingAccounts): PaymentDueDetails {
    let totalPaymentDue = 0;
    let nPaymentsDue = 0;
    data.billingAccounts.forEach(account => {
      totalPaymentDue += account.balance;
      if (account.balance > 0) nPaymentsDue++;
    });
    return {
      totalPaymentDue: totalPaymentDue,
      nPaymentsDue: nPaymentsDue,
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
