import {Injectable, OnDestroy} from '@angular/core';
import {BaseService} from '../base/base-factory-provider';
import {endPoints, loginEndpoints} from './constants/endpoints';
import {SharedUtilityService} from '../utility/utility.service';
import {
  Contribution,
  YTDContribution,
} from './models/retirement-account/info/contribution.model';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  Observable,
  of,
  ReplaySubject,
  Subject,
  Subscription,
} from 'rxjs';
import {
  HSATransaction,
  RootObject,
  TransactionHistory,
} from './models/retirement-account/transactions/transactions.model';
import {Dividend} from './models/retirement-account/info/dividends.model';
import * as moment from 'moment';
import {PlanAdviceStatusClient} from './models/retirement-account/info/adviceStatus';
import {EmployersMatch} from './models/retirement-account/info/employersMatch.model';
import {GainLoss} from './models/retirement-account/info/gainloss.model';
import {OutstandingLoan} from './models/retirement-account/info/outstandingLoan.model';
import {RateOfReturn} from './models/retirement-account/info/rateOfReturn.model';
import {VestedBalance} from './models/retirement-account/info/vestedBalance.model';
import {
  Account,
  AccountsData,
  ExternalLink,
  HSAAccount,
  HSAAccountsObject,
  Participant,
  SubAccountsData,
} from './models/accountres.model';
import {
  AccountContent,
  AddAccountLandingContent,
} from '@shared-lib/models/add-account-landing.model';
import {
  AccountGroup,
  HSAorFSA,
} from '@shared-lib/services/account/models/all-accounts.model';
import {
  PredictiveMessage,
  RootCarouselOfferCode,
} from '@shared-lib/models/carousel-offercode.model';
import {RootObjectOfferCode} from '../../../shared-lib/models/predictive-offercode.model';
import {OfferCode} from '../../../shared-lib/models/offercode.model';
import {concatMap, map} from 'rxjs/operators';
import {AccessService} from '../access/access.service';
import {AccessResult} from '../access/models/access.model';
import {Environment} from '@shared-lib/models/environment.model';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {FilterList, FilterModels} from '../../models/filter-sort.model';
import {MXService} from '../mx-service/mx.service';
import {BalanceHistoryGraph} from './models/balance-history-graph.model';
import {LoadingController} from '@ionic/angular';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {QueryAccessToken} from '../benefits/open-savvi/models/queryAccessToken.model';
import {MoneyOutDetailItem} from './models/moneyOut.model';

export const SESSION_TIMEOUT_DURATION = 14 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnDestroy {
  endPoints = endPoints;
  loginEndpoints;
  account: Account;
  hsaAccount: SubAccountsData;
  accountInfo: AccountsData;
  hasHSAorFSA: HSAorFSA;
  allAccountsWithOutHSAInfo: AccountsData;
  allAccountsWithHSAInfo: AccountsData;
  private predictiveMessage: Observable<PredictiveMessage> = null;
  private predictiveMessage$: ReplaySubject<PredictiveMessage> = null;
  private environment: Environment;
  private participantData: Observable<Participant> = null;
  private participantSubject: ReplaySubject<Participant> = null;
  private accountLocalStorageSubject: ReplaySubject<Account> = null;
  private subscription: Subscription = new Subscription();
  private offercodes: OfferCode[];
  private externalLinksData: Observable<ExternalLink[]> = null;
  private externalLinksDataSubscriptionList: any = {};
  private externalLinksSubject: ReplaySubject<ExternalLink[]> = null;
  private selectedTab$: Subject<string> = new Subject<string>();
  private allAccountData: Observable<AccountsData> = null;
  private allAccountsWithoutHSAData: Observable<AccountsData> = null;
  private allAccountsWithoutHSASubject: ReplaySubject<AccountsData>;
  private allAccountsWithHSAData: Observable<AccountsData> = null;
  private allAccountsWithHSASubject: ReplaySubject<AccountsData>;
  private allAccountSubject: ReplaySubject<AccountsData> = null;
  private aggregatedAcctData: Observable<AccountGroup>;
  private aggregatedAccountDataSubject: ReplaySubject<AccountGroup> = null;
  private accountsContent: Observable<AccountContent>;
  private accountsContent$: ReplaySubject<AccountContent> = null;
  private sort = new BehaviorSubject<string>('');
  private filt = new BehaviorSubject<FilterList[]>([]);
  private balanceHistoryGraphData: Observable<BalanceHistoryGraph> = null;
  private balanceHistoryGraphSubject: ReplaySubject<BalanceHistoryGraph> = null;
  private moneyOutData: Observable<MoneyOutDetailItem[]>;
  private moneyOutDataSubject: ReplaySubject<MoneyOutDetailItem[]> = null;
  addAccountlandingContent: AddAccountLandingContent;
  storedFilterKey = [];
  storedSortKey = '';

  today = new Date();
  priorDate = moment(new Date().setDate(this.today.getDate() - 90)).format(
    'YYYY/MM/DD'
  );
  currentDate = moment(Date.now()).format('YYYY/MM/DD');
  isWeb: boolean;
  previousAcctInLocalStorage: Account;

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private accessService: AccessService,
    private inAppBrowserService: InAppBroserService,
    private mxService: MXService,
    private loadingController: LoadingController,
    private authService: AuthenticationService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.environment = this.utilityService.getEnvironment();
    this.loginEndpoints = this.utilityService.appendBaseUrlToEndpoints(
      loginEndpoints,
      this.environment.loginBaseUrl
    );
    this.participantSubject = new ReplaySubject(1);
    this.balanceHistoryGraphSubject = new ReplaySubject(1);
    this.externalLinksSubject = new ReplaySubject(1);
    this.allAccountSubject = new ReplaySubject(1);
    this.aggregatedAccountDataSubject = new ReplaySubject(1);
    this.moneyOutDataSubject = new ReplaySubject(1);
    this.account = JSON.parse(localStorage.getItem('currentAccount'));
    this.isWeb = this.utilityService.getIsWeb();
    this.predictiveMessage$ = new ReplaySubject(1);
    this.accountsContent$ = new ReplaySubject(1);
    this.accountLocalStorageSubject = new ReplaySubject(1);
    this.allAccountsWithoutHSASubject = new ReplaySubject(1);
    this.allAccountsWithHSASubject = new ReplaySubject(1);
  }

  async getJSON(refresh = false): Promise<AccountsData> {
    if (!this.accountInfo || refresh) {
      const sessionID = await this.accessService.getSessionId();
      const accountsData = await this.baseService.get(
        this.endPoints.allAccounts + sessionID
      );
      accountsData.hsaAccounts = await this.getHSAAccounts();
      this.accountInfo = accountsData;
    }
    return this.accountInfo;
  }

  async getAllAccountsWithOutHSA(refresh = false): Promise<AccountsData> {
    try {
      if (!this.allAccountsWithOutHSAInfo || refresh) {
        const sessionID = await this.accessService.getSessionId();
        this.allAccountsWithOutHSAInfo = await this.baseService.get(
          this.endPoints.allAccounts + sessionID
        );
      }
    } catch (e) {
      console.log(e);
      this.allAccountsWithOutHSAInfo = undefined;
    }
    return this.allAccountsWithOutHSAInfo;
  }

  async getOnlyWithHSAAccount(refresh = false): Promise<AccountsData> {
    try {
      if (!this.allAccountsWithHSAInfo || refresh) {
        const accountData = await this.getHSAAccounts();
        this.allAccountsWithHSAInfo = {hsaAccounts: accountData};
      }
    } catch (e) {
      console.log(e);
      this.allAccountsWithHSAInfo = undefined;
    }
    return this.allAccountsWithHSAInfo;
  }

  async getHSAorFSA(): Promise<HSAorFSA> {
    if (!this.hasHSAorFSA) {
      const accounts: HSAorFSA = {
        hsa: false,
        fsa: false,
      };

      const accData = await this.getJSON();
      accData.hsaAccounts.accounts.forEach(acc => {
        if (acc.hsaAccountData.Plan_Type == 'HSA') {
          accounts.hsa = true;
        } else if (acc.hsaAccountData.Plan_Type == 'MedicalFlex') {
          accounts.fsa = true;
        }
      });

      const mxAccs = await firstValueFrom(this.mxService.getMxAccountConnect());
      mxAccs.accounts.forEach(acc => {
        if (
          acc.account_type_name === 'Savings' &&
          acc.account_subtype_name === 'HEALTH'
        ) {
          accounts.hsa = true;
        }
      });

      this.hasHSAorFSA = accounts;
    }
    return this.hasHSAorFSA;
  }

  private async constructAggregatedAccounts(): Promise<AccountGroup> {
    const sessionID = await this.accessService.getSessionId();

    return this.baseService.get(
      `${this.endPoints.aggregatedAccounts + sessionID}`
    );
  }

  getAggregatedAccounts(refresh = false): Observable<AccountGroup> {
    if (!this.aggregatedAcctData || refresh) {
      this.mxService.setUserAccountUpdate(false);
      this.aggregatedAcctData = from(this.constructAggregatedAccounts());
      const subscription = this.aggregatedAcctData.subscribe(result => {
        this.aggregatedAccountDataSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.aggregatedAccountDataSubject;
  }

  //#region

  getExternalLinks(refresh = false): Observable<ExternalLink[]> {
    const existingExternalLinksDataSubscription = this
      .externalLinksDataSubscriptionList[this.account.planId];
    if (
      (!existingExternalLinksDataSubscription || refresh) &&
      this.account.isSavingsPlan
    ) {
      this.accessService
        .checkMyvoyageAccess()
        .then(async (res: AccessResult) => {
          const [
            domain,
            clientId,
            sessionID,
          ] = await this.getExternalLinkParameterInfo(res);

          const url = this.endPoints.externalLinks
            .replace('{planID}', this.account.planId)
            .replace('{client}', clientId)
            .replace('{sessionID}', sessionID)
            .replace('{domain}', domain);

          this.externalLinksData = from(this.baseService.get(url));
          const subscription = this.externalLinksData.subscribe(result => {
            this.externalLinksSubject.next(result);
            this.externalLinksDataSubscriptionList[
              this.account.planId
            ] = result;
          });
          this.subscription.add(subscription);
        });
    } else if (this.externalLinksDataSubscriptionList[this.account.planId]) {
      this.externalLinksSubject.next(existingExternalLinksDataSubscription);
    }

    return this.externalLinksSubject;
  }

  async getExternalLinkParameterInfo(res: AccessResult) {
    const domain =
      this.account.clientDomain != res.clientDomain
        ? this.account.clientDomain
        : res.clientDomain;
    const clientId =
      this.account.clientId != res.clientId
        ? this.account.clientId
        : res.clientId;
    const sessionID = this.account.csSessionId
      ? this.account.csSessionId
      : await this.accessService.getSessionId();
    return [domain, clientId, sessionID];
  }

  async getVestedBalance(): Promise<VestedBalance> {
    return this.baseService.get(
      this.endPoints.vestedBalance +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getGainLoss(): Promise<GainLoss> {
    return this.baseService.get(
      this.endPoints.gainLoss +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getLoan(): Promise<OutstandingLoan> {
    return this.baseService.get(
      this.endPoints.loan + this.account.clientId + '/' + this.account.planId
    );
  }

  async getRateOfReturn(): Promise<RateOfReturn> {
    return this.baseService.get(
      this.endPoints.rateOfReturn +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getPlanAdviceStatuses(): Promise<PlanAdviceStatusClient> {
    return this.baseService.get(this.endPoints.planAdviceStatus);
  }

  getDividends(): Promise<Dividend> {
    return this.baseService.get(
      this.endPoints.dividend +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getContribution(): Promise<Contribution> {
    return this.baseService.get(
      this.endPoints.contribution +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getYTDContribution(): Promise<YTDContribution> {
    return this.baseService.get(
      this.endPoints.ytdcontribution +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getEmployersMatch(): Promise<EmployersMatch> {
    return this.baseService.get(
      this.endPoints.employersmatch +
        this.account.clientId +
        '/' +
        this.account.planId
    );
  }

  async getTransaction(): Promise<RootObject> {
    if (this.account.isHSAAccount) {
      return this.getHSATransactions();
    } else {
      return this.baseService.get(
        this.endPoints.transaction +
          this.account.clientId +
          '/' +
          this.account.planId +
          '?tranType=ALL&startDate=' +
          this.priorDate +
          '&endDate=' +
          this.currentDate
      );
    }
  }

  getAccount(): Account {
    if (!this.account) {
      this.account = JSON.parse(localStorage.getItem('currentAccount'));
    }
    return this.account;
  }

  setAccount(account: Account): void {
    localStorage.setItem('currentAccount', JSON.stringify(account));
    this.account = account;
  }

  setAccountLocalStorage(data: Account) {
    if (data !== this.previousAcctInLocalStorage) {
      this.setAccount(data);
      this.previousAcctInLocalStorage = data;
      this.accountLocalStorageSubject.next(data);
    }
  }

  getAccountLocalStorage(): Observable<Account> {
    return this.accountLocalStorageSubject.asObservable();
  }

  getParticipant(refresh = false): Observable<Participant> {
    if (!this.participantData || refresh) {
      this.participantData = from(
        this.baseService.get(this.endPoints.participantData)
      );
      const subscription = this.participantData.subscribe(result => {
        this.participantSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.participantSubject;
  }

  setParticipant(participant: Participant) {
    this.participantSubject.next(participant);
  }

  async getOffercode(): Promise<OfferCode[]> {
    if (!this.offercodes) {
      const sessionID = await this.accessService.getSessionId();
      this.offercodes = await this.baseService.get(
        this.endPoints.getOfferCode + sessionID
      );
    }
    return this.offercodes;
  }

  async getPredict(): Promise<RootObjectOfferCode> {
    return new Promise(resolve => {
      this.subscription.add(
        this.fetchPredictiveMessage().subscribe(response => {
          resolve(
            response.OfferCodeAdviceJSON
              ? JSON.parse(response.OfferCodeAdviceJSON)
              : null
          );
        })
      );
    });
  }

  async getCarouselData(): Promise<RootCarouselOfferCode> {
    return new Promise(resolve => {
      this.subscription.add(
        this.fetchPredictiveMessage().subscribe(response => {
          resolve(
            response.OfferCodeJSON ? JSON.parse(response.OfferCodeJSON) : null
          );
        })
      );
    });
  }

  fetchBalanceHistoryGraph(): Observable<BalanceHistoryGraph> {
    if (!this.balanceHistoryGraphData) {
      this.balanceHistoryGraphData = from(
        this.baseService.get(this.endPoints.balancehistory)
      );

      const subscription = this.balanceHistoryGraphData.subscribe(result => {
        this.balanceHistoryGraphSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.balanceHistoryGraphSubject;
  }

  fetchPredictiveMessage(refresh = false): Observable<PredictiveMessage> {
    if (!this.predictiveMessage || refresh) {
      this.predictiveMessage = from(
        this.baseService.get(this.endPoints.predictiveMessage)
      );
      const subscription = this.predictiveMessage.subscribe(data => {
        this.predictiveMessage$.next(data);
      });
      this.subscription.add(subscription);
    }
    return this.predictiveMessage$;
  }

  posNegSymbol(val: number) {
    if (val && +val) {
      return val < 0 ? '' : '+';
    }
    return '';
  }

  getSelectedTab$(): Subject<string> {
    return this.selectedTab$;
  }

  publishSelectedTab(selectedTab: string) {
    this.selectedTab$.next(selectedTab);
  }

  getAllAccounts(refresh = false): Observable<AccountsData> {
    if (!this.allAccountData || refresh) {
      this.allAccountData = from(this.getJSON());
      const allAccountSubscription = this.allAccountData.subscribe(
        (data: AccountsData) => {
          this.allAccountSubject.next(data);
        }
      );
      this.subscription.add(allAccountSubscription);
    }
    return this.allAccountSubject;
  }

  allAccountsWithoutHSA(refresh = false): Observable<AccountsData> {
    if (!this.allAccountsWithoutHSAData || refresh) {
      this.allAccountsWithoutHSAData = from(this.getAllAccountsWithOutHSA());
      const subscription = this.allAccountsWithoutHSAData.subscribe(
        (data: AccountsData) => {
          this.allAccountsWithoutHSASubject.next(data);
        }
      );
      this.subscription.add(subscription);
    }
    return this.allAccountsWithoutHSASubject;
  }

  allAccountsWithHSA(refresh = false): Observable<AccountsData> {
    if (!this.allAccountsWithHSAData || refresh) {
      this.allAccountsWithHSAData = from(this.getOnlyWithHSAAccount());
      const subscription = this.allAccountsWithHSAData.subscribe(
        (data: AccountsData) => {
          this.allAccountsWithHSASubject.next(data);
        }
      );
      this.subscription.add(subscription);
    }
    return this.allAccountsWithHSASubject;
  }

  getAccountDataBasedOnType(
    planId: string,
    type: string,
    refresh = false
  ): Observable<Account> {
    return this.allAccountsWithoutHSA(refresh).pipe(
      map(
        data =>
          data[type] &&
          data[type].accounts.filter(
            account => account.planId === planId && !account.isVoyaAccessPlan
          )[0]
      )
    );
  }

  getNonHSAAccountDataWithoutType(
    planId: string,
    refresh = false
  ): Observable<Account> {
    return this.allAccountsWithoutHSA(refresh).pipe(
      map(
        data =>
          (data['retirementAccounts'] &&
            data['retirementAccounts'].accounts.filter(
              account => account.planId === planId && !account.isVoyaAccessPlan
            )[0]) ||
          (data['stockAccounts'] &&
            data['stockAccounts'].accounts.filter(
              account => account.planId === planId && !account.isVoyaAccessPlan
            )[0]) ||
          (data['vendorAccounts'] &&
            data['vendorAccounts'].accounts.filter(
              account => account.planId === planId && !account.isVoyaAccessPlan
            )[0]) ||
          (data['brokerageAccounts'] &&
            data['brokerageAccounts'].accounts.filter(
              account => account.planId === planId && !account.isVoyaAccessPlan
            )[0])
      )
    );
  }

  getAccountDataWithoutType(
    planId: string,
    refresh = false
  ): Observable<Account> {
    return this.getNonHSAAccountDataWithoutType(planId, refresh).pipe(
      concatMap(data => {
        if (data) {
          return of(data);
        } else {
          return this.allAccountsWithHSA(refresh).pipe(
            map(data => {
              return (
                data['hsaAccounts'] &&
                data['hsaAccounts'].accounts.filter(
                  account =>
                    account.planId === planId && !account.isVoyaAccessPlan
                )[0]
              );
            })
          );
        }
      })
    );
  }

  private filterIsVoyaAccessPlanAccountData(
    data: AccountsData,
    type,
    planId,
    agreementId
  ): Account {
    return (
      data[type] &&
      data[type].accounts.filter(
        account =>
          account.planId === planId &&
          account.agreementId === agreementId &&
          account.isVoyaAccessPlan
      )[0]
    );
  }

  getIsVoyaAccessPlanAccountData(
    planId: string,
    agreementId: string,
    refresh = false
  ): Observable<Account> {
    return this.allAccountsWithoutHSA(refresh).pipe(
      map(
        data =>
          this.filterIsVoyaAccessPlanAccountData(
            data,
            'retirementAccounts',
            planId,
            agreementId
          ) ||
          this.filterIsVoyaAccessPlanAccountData(
            data,
            'stockAccounts',
            planId,
            agreementId
          ) ||
          this.filterIsVoyaAccessPlanAccountData(
            data,
            'vendorAccounts',
            planId,
            agreementId
          )
      )
    );
  }

  async openPwebAccountLink(link: string, target?: string) {
    if (this.utilityService.getIsWeb()) {
      window.open(link, target || '_blank');
    } else {
      const loading = await this.loadingController.create({
        translucent: true,
      });
      await loading.present();
      const authToken = await this.authService.getAccessToken();
      const request = {
        client_id: this.environment.authTokenExchangeClient,
        subject_token: authToken,
        subject_token_type: 'access_token',
        audience: this.environment.loginBaseUrl + this.environment.samlAudience,
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        requested_token_type: 'access_token',
        scope: 'urn:voya:federation',
      };
      const queryAuthTokenResponse: QueryAccessToken = await this.baseService.postUrlEncoded(
        this.environment.tokenBaseUrl + 'oidcop/sps/oauth/oauth20/token',
        request,
        {}
      );
      loading.dismiss();
      const url = this.encodePwebAccountLink(
        link,
        queryAuthTokenResponse.access_token
      );
      this.inAppBrowserService.openSystemBrowser(url);
    }
  }

  private encodePwebAccountLink(link: string, access_token: string): string {
    return (
      this.loginEndpoints.authService.replace(
        '[exchanged_access_token]',
        access_token
      ) + encodeURIComponent(link)
    );
  }

  openInAppBrowser(link: string) {
    this.inAppBrowserService.openSystemBrowser(link);
  }

  transformHSAAccount(hsa: HSAAccount): Account {
    let totalBal = hsa.CashBalance;
    if (hsa.Plan_Type === 'HSA') {
      totalBal = hsa.TotalBalance;
    }

    const acc: Account = {
      accountTitle: hsa.Plan_Name,
      accountBalance: totalBal.toString(),
      accountBalanceAsOf: hsa.AsOfDate,
      sourceSystem: '',
      suppressTab: false,
      voyaSavings: '',
      includedInOrangeMoney: false,
      accountAllowedForMyVoya: false,
      clientId: '',
      planId: hsa.Plan_ID.toString(),
      planType: hsa.Plan_Type,
      accountNumber: '',
      needOMAutomaticUpdate: false,
      planName: hsa.Plan_Name,
      mpStatus: '',
      clientAllowed4myVoyaOrSSO: false,
      useMyvoyaHomepage: false,
      advisorNonMoneyTxnAllowed: false,
      advisorMoneyTxnAllowed: false,
      nqPenCalPlan: false,
      enrollmentAllowed: false,
      autoEnrollmentAllowed: false,
      vruPhoneNumber: '',
      rmdRecurringPaymentInd: '',
      navigateToRSPortfolio: false,
      planLink: '',
      openDetailInNewWindow: false,
      nqPlan: false,
      new: false,
      eligibleForOrangeMoney: false,
      iraplan: false,
      xsellRestricted: false,
      isVoyaAccessPlan: false,
      isRestrictedRetirementPlan: false,
      isVDAApplication: false,
      isVendorPlan: false,
      isHSAAccount: true,
      hsaAccountData: hsa,
    };
    return acc;
  }

  async getHSAAccounts(): Promise<SubAccountsData> {
    const sessionID = await this.accessService.getSessionId();
    const result: HSAAccountsObject = await this.baseService.get(
      this.endPoints.allHSAAccounts + sessionID
    );
    if (!result) {
      return {
        dataStatus: 'failed',
        errorCode: '',
        accounts: [],
      };
    }

    const resultArr: Account[] = [];
    result?.AllAccountsBalance?.forEach(element => {
      resultArr.push(this.transformHSAAccount(element));
    });
    return {
      dataStatus: result.Status,
      errorCode: '',
      accounts: resultArr,
    };
  }

  transformHSATransaction(hsaTransaction: HSATransaction): TransactionHistory {
    return {
      tradeDate: hsaTransaction.Transaction_Date,
      type: '',
      tranCode: hsaTransaction.Transaction_Code,
      cash: hsaTransaction.Transaction_Amt,
      clientId: '',
      planId: hsaTransaction.Plan_ID.toString(),
      participantId: '',
      unit_or_unshrs: '',
      br140_new_val_cash: '',
      br161_shr_price: '',
      br009_run_date: '',
      br011_seq_num: '',
      br980_ACT_NAME: hsaTransaction.Transaction_Description,
      br172_vouch_num: '',
      isHSATransaction: true,
      hsaTransactionData: hsaTransaction,
    };
  }

  async getHSATransactions(): Promise<RootObject> {
    const hasPartyID = this.account.hsaAccountData?.HAS_PARTY_ID;
    const planId = this.account.hsaAccountData?.Plan_ID;
    const url = this.endPoints.hsaTransactions + hasPartyID + '/' + planId;

    const result = await this.baseService.get(url);

    const resultArr: TransactionHistory[] = [];
    result.AllAccountsTransactions.forEach(element => {
      resultArr.push(this.transformHSATransaction(element));
    });
    return {
      transactionHistories: resultArr,
    };
  }

  getDisplayNameOrFirst(participant: Participant): string {
    if (
      participant.displayName &&
      participant.displayName.length > 0 &&
      participant.displayName.toLocaleLowerCase() !=
        participant.lastName.toLocaleLowerCase() +
          ', ' +
          participant.firstName.toLocaleLowerCase()
    ) {
      return participant.displayName;
    }

    return participant.firstName;
  }

  getDisplayNameOrFirstOrLast(participant: Participant): string {
    const displayName = participant.displayName ? participant.displayName : '';
    const firstName = participant.firstName ? participant.firstName : '';
    const lastName = participant.lastName ? participant.lastName : '';
    if (
      displayName.length > 0 &&
      ((displayName.includes(',') &&
        displayName.toLocaleLowerCase() !=
          firstName.toLocaleLowerCase() +
            ', ' +
            lastName.toLocaleLowerCase()) ||
        (!displayName.includes(',') &&
          displayName.toLocaleLowerCase() !=
            firstName.toLocaleLowerCase() + ' ' + lastName.toLocaleLowerCase()))
    ) {
      return displayName;
    } else if (firstName.length > 0) {
      return firstName;
    } else {
      return lastName;
    }
  }

  getDisplayNameOrFirstLast(participant: Participant): string {
    const displayName = participant.displayName ? participant.displayName : '';
    const firstName = participant.firstName ? participant.firstName : '';
    const lastName = participant.lastName ? participant.lastName : '';
    if (
      displayName.length > 0 &&
      displayName.toLocaleLowerCase() !=
        firstName.toLocaleLowerCase() + ', ' + lastName.toLocaleLowerCase()
    ) {
      return displayName;
    } else {
      return firstName + ' ' + lastName;
    }
  }

  changeSort(data: string) {
    this.sort.next(data);
  }

  currentSort(): Observable<string> {
    return this.sort.asObservable();
  }

  async getAddAcctModalContent(): Promise<AddAccountLandingContent> {
    return new Promise(resolve => {
      this.subscription.add(
        this.fetchAccountsContent().subscribe(response => {
          resolve(
            response.WorkplaceAddAccountsModalJSON
              ? JSON.parse(response.WorkplaceAddAccountsModalJSON)
              : null
          );
        })
      );
    });
  }

  async getSectionValues(): Promise<FilterModels> {
    return new Promise(resolve => {
      this.subscription.add(
        this.fetchAccountsContent().subscribe(response => {
          resolve(
            response.HSA_Transaction_FilterSort_SelectionList
              ? JSON.parse(response.HSA_Transaction_FilterSort_SelectionList)
              : null
          );
        })
      );
    });
  }

  fetchAccountsContent(refresh = false): Observable<AccountContent> {
    if (!this.accountsContent || refresh) {
      this.accountsContent = from(
        this.baseService.get(this.endPoints.accountsContent)
      );
      const subscription = this.accountsContent.subscribe(data => {
        this.accountsContent$.next(data);
      });
      this.subscription.add(subscription);
    }
    return this.accountsContent$;
  }

  changeFilt(data: FilterList[]) {
    this.filt.next(data);
  }

  setFiltSlcted(keyName: string[]) {
    this.storedFilterKey = keyName;
    localStorage.setItem('storedFilterKey', JSON.stringify(keyName));
  }

  getFiltSlcted() {
    if (!this.storedFilterKey) {
      this.storedFilterKey = JSON.parse(
        localStorage.getItem('storedFilterKey')
      );
    }
    return this.storedFilterKey;
  }

  currentFilter(): Observable<FilterList[]> {
    return this.filt.asObservable();
  }

  setSortSlcted(keyName: string) {
    this.storedSortKey = keyName;
    localStorage.setItem('storedSortKey', JSON.stringify(keyName));
  }

  getSortSlcted() {
    if (!this.storedSortKey) {
      this.storedSortKey = JSON.parse(localStorage.getItem('storedSortKey'));
    }
    return this.storedSortKey;
  }

  //#endregion
  private async getMoneyOutStatusDetails(): Promise<MoneyOutDetailItem[]> {
    const sessionID = await this.accessService.getSessionId();
    const moneyoutInfo = await this.baseService.get(
      this.endPoints.moneyOut + sessionID
    );
    return moneyoutInfo;
  }

  getMoneyOutStatus(refresh = false): Observable<MoneyOutDetailItem[]> {
    if (!this.moneyOutData || refresh) {
      this.moneyOutData = from(this.getMoneyOutStatusDetails());
      const subscription = this.moneyOutData.subscribe(result => {
        this.moneyOutDataSubject.next(result);
      });
      this.subscription.add(subscription);
    }
    return this.moneyOutDataSubject;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
