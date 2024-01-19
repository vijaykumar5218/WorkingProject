import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AccountService} from './account.service';
import {endPoints} from './constants/endpoints';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import * as moment from 'moment';
import {AccountGroup} from '@shared-lib/services/account/models/all-accounts.model';
import {
  Account,
  AccountsData,
  HSAAccount,
  Participant,
} from './models/accountres.model';
import {of, Subject, Subscription} from 'rxjs';
import {AccessService} from '../access/access.service';
import {Environment} from '@shared-lib/models/environment.model';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {
  HSATransaction,
  TransactionHistory,
} from './models/retirement-account/transactions/transactions.model';
import {FilterList} from '../../models/filter-sort.model';
import {MXService} from '../mx-service/mx.service';
import {MXAccount} from '../mx-service/models/mx.model';
import {QueryAccessToken} from '../benefits/open-savvi/models/queryAccessToken.model';
import {LoadingController} from '@ionic/angular';
import {AuthenticationService} from '../../../mobile/src/app/modules/shared/service/authentication/authentication.service';
import {AccessResult} from '../access/models/access.model';

describe('AccountService', () => {
  let utilityServiceSpy;
  let service: AccountService;
  let baseServiceSpy;
  let accessServiceSpy;
  let inAppBrowserSpy;
  let mxServiceSpy;
  let authServiceSpy;
  let loadingControllerSpy;

  const emptyAccount = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: '',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '2345',
    planId: '32323',
    planType: '',
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: '',
    mpStatus: '',
    firstName: '',
    lastName: '',
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
    agreementId: '56',
  };

  const voyaAccessPlanAcct = {
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: '',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '2345',
    planId: '32323',
    planType: '',
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: '',
    mpStatus: '',
    firstName: '',
    lastName: '',
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
    isVoyaAccessPlan: true,
    isRestrictedRetirementPlan: false,
    isVDAApplication: false,
    isVendorPlan: false,
    agreementId: '56',
  };

  const emptyAccountsData: AccountsData = {
    retirementAccounts: {
      dataStatus: 'OK',
      errorCode: 'NO_ERROR',
      accounts: [emptyAccount],
    },
    vendorAccounts: {
      accounts: [],
    },
    stockAccounts: {
      accounts: [],
    },
  };

  const hsaAccount: HSAAccount = {
    HAS_PARTY_ID: 'ABC-12345678',
    Plan_ID: 2078,
    Current_Or_Prior: 'Prior',
    Plan_Year_End_Date: '2021-12-31',
    Plan_Type: 'HSA',
    Plan_Name: 'Dependent Care Flexible Spending Account',
    Election_Amount: 200.38,
    Calculated_Contribution: 14.36,
    YTD_Contributions: 118.02,
    Employer_Election_Amount: 58.03,
    Employer_YTD_Contributions: 238.06,
    AvailableBalance: 875.65,
    CashBalance: 5544.01,
    TotalBalance: 1854.44,
    InvestmentBalance: 45.77,
    AsOfDate: '2022-09-07',
    YTD_Wellness_Contributions: 0,
  };

  const transformedHsa: Account = {
    accountTitle: hsaAccount.Plan_Name,
    accountBalance: hsaAccount.TotalBalance.toString(),
    accountBalanceAsOf: hsaAccount.AsOfDate,
    sourceSystem: '',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '',
    planId: hsaAccount.Plan_ID.toString(),
    planType: hsaAccount.Plan_Type,
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: hsaAccount.Plan_Name,
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
    hsaAccountData: hsaAccount,
  };

  const hsaAccountNonHSA: HSAAccount = {
    HAS_PARTY_ID: 'ABC-12345678',
    Plan_ID: 2078,
    Current_Or_Prior: 'Prior',
    Plan_Year_End_Date: '2021-12-31',
    Plan_Type: 'FSA',
    Plan_Name: 'Dependent Care Flexible Spending Account',
    Election_Amount: 200.38,
    Calculated_Contribution: 14.36,
    YTD_Contributions: 118.02,
    Employer_Election_Amount: 58.03,
    Employer_YTD_Contributions: 238.06,
    AvailableBalance: 875.65,
    CashBalance: 5544.01,
    TotalBalance: 1854.44,
    InvestmentBalance: 45.77,
    AsOfDate: '2022-09-07',
    YTD_Wellness_Contributions: 0,
  };

  const transformedHsaNonHSA: Account = {
    accountTitle: hsaAccountNonHSA.Plan_Name,
    accountBalance: hsaAccountNonHSA.CashBalance.toString(),
    accountBalanceAsOf: hsaAccountNonHSA.AsOfDate,
    sourceSystem: '',
    suppressTab: false,
    voyaSavings: '',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: '',
    planId: hsaAccountNonHSA.Plan_ID.toString(),
    planType: hsaAccountNonHSA.Plan_Type,
    accountNumber: '',
    needOMAutomaticUpdate: false,
    planName: hsaAccountNonHSA.Plan_Name,
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
    hsaAccountData: hsaAccountNonHSA,
  };

  const hsaTransaction: HSATransaction = {
    HAS_PARTY_ID: 'ABC-12345678',
    Plan_ID: 2382372,
    Transaction_Date: '2021-12-31',
    Transaction_Code: '36',
    Transaction_Description: 'Pending Distribution',
    Transaction_Amt: 500,
    Provider_Name: 'ABC Company',
    Claim_Number: 'BSLSNU220217D0002101',
    Service_Recipient: 'John Doe',
    Create_Date: '2021-10-12',
  };

  const accountGroup: AccountGroup = {
    hasMXAccount: true,
    categorizedAccounts: [
      {
        accType: 'Investment',
        accountsCount: 3,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountBalance: '',
            accountBalanceAsOf: '',
            accountNumber: '',
            accountTitle: '',
            accountType: '',
            accountOpenDate: '',
            suppressTab: false,
            planLink: '',
            mediumLogoUrl: '',
            smallLogoUrl: '',
            bodyText: '',
            buttonText: '',
            ebooksLink: {
              label: '',
              url: '',
            },
            sourceSystem: '',
            voyaSavings: '',
            includedInOrangeMoney: false,
            accountAllowedForMyVoya: false,
            clientId: '',
            planId: '',
            planType: '',
            needOMAutomaticUpdate: false,
            planName: '',
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
          },
        ],
      },
    ],
  };

  const transformedHsaTransaction: TransactionHistory = {
    tradeDate: hsaTransaction.Transaction_Date,
    type: '',
    tranCode: hsaTransaction.Transaction_Code,
    cash: 500,
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
  const storedFilterKey = ['test1', 'test2'];
  const storedSortKey = 'asc';

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
        'getIsWeb',
        'getEnvironment',
      ]);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
        endpoints => endpoints
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', [
        'get',
        'post',
        'postUrlEncoded',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
        'isMyWorkplaceDashboardEnabled',
        'getSessionId',
        'initSession',
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(false));
      inAppBrowserSpy = jasmine.createSpyObj('InApBrowserService', [
        'openSystemBrowser',
      ]);

      utilityServiceSpy.getEnvironment.and.returnValue({
        authTokenExchangeClient: 'token_client',
        tokenBaseUrl: 'http://token.test.com/',
        loginBaseUrl: 'http://login.test.com/',
        samlAudience: 'saml/sps/saml-idp-logintest/saml20',
      } as Environment);

      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxAccountConnect',
        'setUserAccountUpdate'
      ]);

      authServiceSpy = jasmine.createSpyObj('AuthService', ['getAccessToken']);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          AccountService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: InAppBroserService, useValue: inAppBrowserSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
        ],
      });
      service = TestBed.inject(AccountService);
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      service.endPoints = endPoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJSON', () => {
    beforeEach(() => {
      const fixedDate = new Date(2020, 0, 1);
      jasmine.clock().install();
      jasmine.clock().mockDate(fixedDate);
    });

    it('get getJSON url', async () => {
      service.account = emptyAccount;
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyAccountsData));
      spyOn(service, 'getHSAAccounts').and.returnValue(
        Promise.resolve({
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        })
      );
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      const result = await service.getJSON();

      expect(result).toEqual({
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        },
      });

      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/all/accounts?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
    });

    it('should used cached data if it exists', async () => {
      service.accountInfo = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        },
      };
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      const result = await service.getJSON();
      expect(result).toEqual({
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        },
      });
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/all/accounts?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
    });

    it('should refresh cached data if refresh passed', async () => {
      service.account = emptyAccount;
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyAccountsData));
      spyOn(service, 'getHSAAccounts').and.returnValue(
        Promise.resolve({
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        })
      );
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      service.accountInfo = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'failure',
          errorCode: '',
          accounts: [],
        },
      };
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      const result = await service.getJSON(true);
      expect(result).toEqual({
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [transformedHsa],
        },
      });
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/all/accounts?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('getAllAccountsWithOutHSA', () => {
    beforeEach(() => {
      const fixedDate = new Date(2020, 0, 1);
      jasmine.clock().install();
      jasmine.clock().mockDate(fixedDate);
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
    });
    it('when allAccountsWithOutHSAInfo is undefined', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyAccountsData));
      service['allAccountsWithOutHSAInfo'] = undefined;
      await service.getAllAccountsWithOutHSA();
      expect(service['allAccountsWithOutHSAInfo']).toEqual({
        ...emptyAccountsData,
      });
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/all/accounts?s=' +
          'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
    });
    it('when allAccountsWithOutHSAInfo is defined', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyAccountsData));
      service['allAccountsWithOutHSAInfo'] = emptyAccountsData;
      await service.getAllAccountsWithOutHSA();
      expect(service['allAccountsWithOutHSAInfo']).toEqual({
        ...emptyAccountsData,
      });
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(accessServiceSpy.getSessionId).not.toHaveBeenCalled();
    });
    it('when allAccountsWithOutHSAInfo is defined and refresh is true', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(emptyAccountsData));
      service['allAccountsWithOutHSAInfo'] = emptyAccountsData;
      await service.getAllAccountsWithOutHSA(true);
      expect(service['allAccountsWithOutHSAInfo']).toEqual({
        ...emptyAccountsData,
      });
      expect(baseServiceSpy.get).toHaveBeenCalled();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
    });
    it('when API get failed', async () => {
      baseServiceSpy.get.and.callFake(() => Promise.reject());
      service['allAccountsWithOutHSAInfo'] = undefined;
      await service.getAllAccountsWithOutHSA();
      expect(service['allAccountsWithOutHSAInfo']).toEqual(undefined);
    });
    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('getOnlyWithHSAAccount', () => {
    it('when allAccountsWithHSAInfo is undefined', async () => {
      spyOn(service, 'getHSAAccounts').and.returnValue(
        Promise.resolve(emptyAccountsData.hsaAccounts)
      );
      service['allAccountsWithHSAInfo'] = undefined;
      await service.getOnlyWithHSAAccount();
      expect(service.getHSAAccounts).toHaveBeenCalled();
      expect(service['allAccountsWithHSAInfo']).toEqual({
        hsaAccounts: emptyAccountsData.hsaAccounts,
      });
    });
    it('when allAccountsWithHSAInfo is defined', async () => {
      spyOn(service, 'getHSAAccounts').and.returnValue(
        Promise.resolve(emptyAccountsData.hsaAccounts)
      );
      service['allAccountsWithHSAInfo'] = {
        hsaAccounts: emptyAccountsData.hsaAccounts,
      };
      await service.getOnlyWithHSAAccount();
      expect(service.getHSAAccounts).not.toHaveBeenCalled();
      expect(service['allAccountsWithHSAInfo']).toEqual({
        hsaAccounts: emptyAccountsData.hsaAccounts,
      });
    });
    it('when allAccountsWithHSAInfo is defined and refresh is true', async () => {
      spyOn(service, 'getHSAAccounts').and.returnValue(
        Promise.resolve(emptyAccountsData.hsaAccounts)
      );
      service['allAccountsWithHSAInfo'] = {
        hsaAccounts: emptyAccountsData.hsaAccounts,
      };
      await service.getOnlyWithHSAAccount(true);
      expect(service.getHSAAccounts).toHaveBeenCalled();
      expect(service['allAccountsWithHSAInfo']).toEqual({
        hsaAccounts: emptyAccountsData.hsaAccounts,
      });
    });
    it('when API get failed', async () => {
      spyOn(service, 'getHSAAccounts').and.callFake(() => Promise.reject());
      service['allAccountsWithHSAInfo'] = undefined;
      await service.getOnlyWithHSAAccount();
      expect(service['allAccountsWithHSAInfo']).toEqual(undefined);
    });
  });

  describe('getHSAorFSA', () => {
    let getJSONSpy;
    beforeEach(() => {
      const mxAccs = {
        accounts: [],
      };

      mxServiceSpy.getMxAccountConnect.and.returnValue(of(mxAccs));

      const accData = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [],
        },
      };
      getJSONSpy = spyOn(service, 'getJSON').and.returnValue(
        Promise.resolve(accData)
      );
    });

    it('should return hsa true if hsa and not fsa from wex', async () => {
      const hsa = {
        hsaAccountData: {
          Plan_Type: 'HSA',
        },
      } as Account;

      const accData = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [hsa],
        },
      };

      getJSONSpy.and.returnValue(Promise.resolve(accData));

      const result = await service.getHSAorFSA();

      expect(service.getJSON).toHaveBeenCalled();
      expect(result).toEqual({
        hsa: true,
        fsa: false,
      });
    });

    it('should return fsa true if fsa and not hsa from wex', async () => {
      const hsa = {
        hsaAccountData: {
          Plan_Type: 'MedicalFlex',
        },
      } as Account;

      const accData = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [hsa],
        },
      };

      getJSONSpy.and.returnValue(Promise.resolve(accData));

      const result = await service.getHSAorFSA();

      expect(service.getJSON).toHaveBeenCalled();
      expect(result).toEqual({
        hsa: false,
        fsa: true,
      });
    });

    it('should return hsa and fsa false if not fsa and hsa', async () => {
      const hsa = {
        hsaAccountData: {
          Plan_Type: 'Other',
        },
      } as Account;
      const hsa2 = {
        hsaAccountData: {
          Plan_Type: 'HRA',
        },
      } as Account;

      const accData = {
        ...emptyAccountsData,
        hsaAccounts: {
          dataStatus: 'success',
          errorCode: '',
          accounts: [hsa, hsa2],
        },
      };

      getJSONSpy.and.returnValue(Promise.resolve(accData));

      const result = await service.getHSAorFSA();

      expect(service.getJSON).toHaveBeenCalled();
      expect(result).toEqual({
        hsa: false,
        fsa: false,
      });
    });

    it('should return hsa if has hsa from mx', async () => {
      const mxAccs = {
        accounts: [
          {
            account_type_name: 'Savings',
            account_subtype_name: 'HEALTH',
          } as MXAccount,
        ],
      };

      mxServiceSpy.getMxAccountConnect.and.returnValue(of(mxAccs));

      const result = await service.getHSAorFSA();

      expect(service.getJSON).toHaveBeenCalled();
      expect(result).toEqual({
        hsa: true,
        fsa: false,
      });
    });

    it('should return hsa false if does not have hsa from mx', async () => {
      const mxAccs = {
        accounts: [
          {
            account_type_name: 'Savings',
            account_subtype_name: 'ACCOUNT',
          } as MXAccount,
        ],
      };

      mxServiceSpy.getMxAccountConnect.and.returnValue(of(mxAccs));

      const result = await service.getHSAorFSA();

      expect(service.getJSON).toHaveBeenCalled();
      expect(result).toEqual({
        hsa: false,
        fsa: false,
      });
    });

    it('should returned cached data if it exists', async () => {
      service.hasHSAorFSA = {
        hsa: true,
        fsa: false,
      };

      const result = await service.getHSAorFSA();

      expect(service.getJSON).not.toHaveBeenCalled();
      expect(result).toEqual({
        hsa: true,
        fsa: false,
      });
    });
  });

  describe('constructAggregatedAccounts', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      baseServiceSpy.get.and.returnValue(Promise.resolve(accountGroup));
    });

    it('should fetch data', async () => {
      const result = await service['constructAggregatedAccounts']();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/accounts?s=Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(accountGroup);
    });
  });

  describe('getAggregatedAccounts', () => {
    let categorizedAccounts;
    let mockAllAccountData;
    beforeEach(() => {
      const fixedDate = new Date(2020, 0, 1);
      jasmine.clock().install();
      jasmine.clock().mockDate(fixedDate);
      categorizedAccounts = {
        accType: 'Investment',
        accountsCount: 3,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountTitle: 'City of Los Angeles DC Plan',
            accountType: 'Investment',
            accountBalance: '71167.48',
            accountBalanceAsOf: '01/12/2023',
            suppressTab: false,
            planLink: '~DEFAULT~',
            accountNumber: '711016@CITYLA@014633871',
          },
        ],
      };
      mockAllAccountData = [
        {
          hasMXAccount: true,
          categorizedAccounts: [categorizedAccounts],
        },
      ];
    });

    it('when aggregatedAcctData is undefined', async () => {
      service[
        'constructAggregatedAccounts'
      ] = jasmine.createSpy().and.returnValue(Promise.resolve(accountGroup));
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      service['aggregatedAcctData'] = undefined;
      baseServiceSpy.get.and.returnValue(Promise.resolve(accountGroup));
      service.getAggregatedAccounts().subscribe(data => {
        expect(service['constructAggregatedAccounts']).toHaveBeenCalled();
        expect(data).toEqual(accountGroup);
      });
      expect(mxServiceSpy.setUserAccountUpdate).toHaveBeenCalledWith(false);
    });

    it('if refresh will be true', async () => {
      service[
        'constructAggregatedAccounts'
      ] = jasmine.createSpy().and.returnValue(Promise.resolve(accountGroup));
      service['aggregatedAcctData'] = mockAllAccountData;
      baseServiceSpy.get.and.returnValue(Promise.resolve(accountGroup));
      service.getAggregatedAccounts(true).subscribe(data => {
        expect(data).toEqual(accountGroup);
        expect(service['constructAggregatedAccounts']).toHaveBeenCalled();
      });
      expect(mxServiceSpy.setUserAccountUpdate).toHaveBeenCalledWith(false);
    });

    it('should not call baseService get if data is already set', async () => {
      service['aggregatedAcctData'] = of(mockAllAccountData);
      const aggregatedAccountDataSubjectSpy = jasmine.createSpyObj(
        'aggregatedAccountDataSubjectSpy',
        ['']
      );
      service['aggregatedAccountDataSubject'] = aggregatedAccountDataSubjectSpy;
      const result = await service.getAggregatedAccounts();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(aggregatedAccountDataSubjectSpy);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('getAddAcctModalContent', () => {
    const mockData = {
      WorkplaceAddAccountsModalJSON:
        '{"addAccount":{"title":"Adding Accounts","subtitle":"Lorem ipsum dolor sit amet consectetur. Suspendisse","benefits":{"title":"Benefits:","list":[{"text":"Organize your financial life"},{"text":"Organize your financial life Get insights on your spending habits to manage your expenses and create a budget"}]},"usefulInfo":{"title":"Useful information to have on hand:","list":[{"text":"Account username"},{"text":"Password"}]},"button":{"text":"Add Account"}}}',
    };
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
    });

    it('when return the actual data', async () => {
      spyOn(service, 'fetchAccountsContent').and.returnValue(observable);
      const result = await service.getAddAcctModalContent();
      expect(service.fetchAccountsContent).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(result).toEqual(
        JSON.parse(mockData.WorkplaceAddAccountsModalJSON)
      );
    });

    it('when return the null data', async () => {
      spyOn(service, 'fetchAccountsContent').and.returnValue(of({}));
      const result = await service.getAddAcctModalContent();
      expect(result).toEqual(null);
    });
  });

  describe('getSectionValues', () => {
    const mockData = {
      HSA_Transaction_FilterSort_SelectionList:
        '{"filterList":[{"label":"Transaction Type","values":[{"name":"Contributions","key":["2","3","6","9","10","13","24","34","39","40","43","44","57","58","59","65","66","67","68"]},{"name":"Distributions","key":["16","17","18","19","21","28","35","36","37","38"]},{"name":"Deductions","key":["1","7","23","41","42","54","55","56"]},{"name":"Refunds","key":["20","27","51","52"]},{"name":"Claims","key":["4","5"]}]}],"sortList":[{"label":"Sort By","values":[{"name":"Earliest Date","value":"asc"},{"name":"Latest Date","value":"dsc"},{"name":"Lowest Amount","value":"low"},{"name":"Highest Amount","value":"high"}]}]}',
    };
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
    });

    it('when return the actual data', async () => {
      spyOn(service, 'fetchAccountsContent').and.returnValue(observable);
      const result = await service.getSectionValues();
      expect(service.fetchAccountsContent).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(result).toEqual(
        JSON.parse(mockData.HSA_Transaction_FilterSort_SelectionList)
      );
    });

    it('when return the null data', async () => {
      spyOn(service, 'fetchAccountsContent').and.returnValue(of({}));
      const result = await service.getSectionValues();
      expect(result).toEqual(null);
    });
  });

  describe('fetchAccountsContent', () => {
    const mockData = {
      HSA_Transaction_FilterSort_SelectionList: '',
      WorkplaceAddAccountsModalJSON: '',
    };

    it('should call get to get the data if accountsContent is undefined', done => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      service['accountsContent'] = undefined;
      service.fetchAccountsContent().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual(mockData);
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(mockData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockData);
          return subscription;
        });
        baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      });

      it('should call get to get the data', done => {
        service['accountsContent'] = observable;
        service.fetchAccountsContent(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(mockData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if accountsContent is defined and refresh is false', () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      service['accountsContent'] = of(mockData);
      const accountsContentSubjectSpy = jasmine.createSpyObj(
        'accountsContentSubjectSpy',
        ['']
      );
      service['accountsContent$'] = accountsContentSubjectSpy;
      const result = service.fetchAccountsContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(accountsContentSubjectSpy);
    });
  });

  describe('getExternalLinks', () => {
    let testExternalLinks;
    let theUrl;
    let serviceGetExternalLinkParameterInfoSpy;
    let serviceExternalLinksDataSpy;
    beforeEach(() => {
      testExternalLinks = [
        {
          id: 'ACCT_HISTORY_LANDING',
          popup: false,
          link: 'https://a.com',
          label: 'Account History',
        },
        {
          id: 'ACCT_CONTRIB',
          popup: false,
          link: 'https://b.com',
          label: 'Manage Contributions',
        },
        {
          id: 'ACCT_MINVEST',
          popup: false,
          link: 'https://c.com',
          label: 'Manage Investments',
        },
        {
          id: 'LOANS_WITHD_LANDING',
          popup: false,
          link: 'https://d.com',
          label: 'Loans & Withdrawals',
        },
        {
          id: 'plan_informationintroduction',
          popup: false,
          link: 'https://e.com',
          label: 'Plan Details',
        },
      ];

      service.account = {
        clientDomain: 'davita401k.intg.voya.com',
        clientId: 'DAVITA',
        csSessionId: 'AAAAAAA.i9291',
        planId: '000000',
        isSavingsPlan: true,
      } as Account;
      baseServiceSpy.get.and.returnValue(Promise.resolve(testExternalLinks));
      baseServiceSpy.get.calls.reset();

      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          clientDomain: 'test.domain',
          clientId: 'TEST_CLIENT_ID',
          clientName: 'TEST_CLIENT_NAME',
          enableMyVoyage: 'Y',
          planIdList: ['plan_a'],
        })
      );

      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('AAAAAAA.i9291')
      );
      theUrl =
        'myvoyage/ws/ers/service/navlinks/DAVITA/000000?s=AAAAAAA.i9291&domain=davita401k.intg.voya.com';
      serviceGetExternalLinkParameterInfoSpy = jasmine.createSpyObj(
        service['getExternalLinkParameterInfo'],
        ['getExternalLinkParameterInfo']
      );
      serviceGetExternalLinkParameterInfoSpy.getExternalLinkParameterInfo.and.returnValue(
        Promise.resolve(['davita401k.intg.voya.com', 'DAVITA', 'AAAAAAA.i9291'])
      );
      serviceExternalLinksDataSpy = jasmine.createSpyObj(
        service['externalLinksData'],
        ['subscribe']
      );
      serviceExternalLinksDataSpy.subscribe.and.returnValue(
        Promise.resolve(testExternalLinks)
      );
    });

    it('should load external links data', async () => {
      const observalble = service.getExternalLinks();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      observalble.subscribe(d => {
        expect(d).toBeDefined();
        expect(baseServiceSpy.get).toHaveBeenCalledWith(theUrl);
      });
    });

    it('should load external links data for different account data', async () => {
      service['externalLinksDataSubscriptionList'][
        '000000'
      ] = testExternalLinks;
      service.account = {
        clientDomain: 'voyaretirement.intg.voya.com',
        clientId: 'INGWIN',
        csSessionId: '4TS0m2xXBjG9wy2cjBh02A11.i9291',
        planId: '000001',
        isSavingsPlan: true,
      } as Account;
      const observalble = service.getExternalLinks();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      observalble.subscribe(d => {
        expect(d).toBeDefined();
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/navlinks/INGWIN/000001?s=4TS0m2xXBjG9wy2cjBh02A11.i9291&domain=voyaretirement.intg.voya.com'
        );
      });
    });

    it('should not load external links for non retirement accounts', () => {
      service.account = {
        clientDomain: 'voyaretirement.intg.voya.com',
        clientId: 'INGWIN',
        csSessionId: '4TS0m2xXBjG9wy2cjBh02A11.i9291',
        planId: '000001',
        isSavingsPlan: false,
      } as Account;
      service['externalLinksDataSubscriptionList']['000000'] = of([
        testExternalLinks,
      ]);
      service.getExternalLinks();
      expect(accessServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
    });

    it('should not load external links data if exists', () => {
      const data = {
        id: '',
        link: '',
        label: '',
        popup: false,
      };
      service['externalLinksDataSubscriptionList']['000000'] = of([data]);
      service.getExternalLinks();
      expect(accessServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
    });
  });

  describe('getExternalLinkParameterInfo', () => {
    it('should take account info', async () => {
      service.account = {
        clientDomain: 'voyaretirement.intg.voya.com',
        clientId: 'INGWIN',
        csSessionId: '4TS0m2xXBjG9wy2cjBh02A11.i9291',
        planId: '000001',
        isSavingsPlan: true,
      } as Account;
      const [
        actualDomain,
        actualClientId,
        actualSessionID,
      ] = await service.getExternalLinkParameterInfo({
        clientDomain: 'davita401k.intg.voya.com',
        clientId: 'DAVITA',
      } as AccessResult);
      expect(actualDomain).toEqual('voyaretirement.intg.voya.com');
      expect(actualClientId).toEqual('INGWIN');
      expect(actualSessionID).toEqual('4TS0m2xXBjG9wy2cjBh02A11.i9291');
      service.account = emptyAccount;
    });

    it('should take myvoyageenabled info', async () => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('AAAAAAA.i9291')
      );
      service.account = {
        clientDomain: 'davita401k.intg.voya.com',
        clientId: 'DAVITA',
      } as Account;
      const [
        actualDomain,
        actualClientId,
        actualSessionID,
      ] = await service.getExternalLinkParameterInfo({
        clientDomain: 'davita401k.intg.voya.com',
        clientId: 'DAVITA',
      } as AccessResult);
      expect(actualDomain).toEqual('davita401k.intg.voya.com');
      expect(actualClientId).toEqual('DAVITA');
      expect(actualSessionID).toEqual('AAAAAAA.i9291');
      service.account = emptyAccount;
    });
  });

  describe('getVestedBalance', () => {
    it('get vestedBalace url', async () => {
      service.account = emptyAccount;

      const vested = {
        totalVestedBal: 0,
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(vested));
      const result = await service.getVestedBalance();
      expect(result).toEqual(vested);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/rsdata/balance/vested/2345/32323'
      );
    });
  });

  describe('getGainLoss', () => {
    it('get GainLoss url', async () => {
      service.account = emptyAccount;

      const gainLossData = {
        balDate: '',
        balance: '',
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(gainLossData));
      const result = await service.getGainLoss();
      expect(result).toEqual(gainLossData);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/participation/history/balancehistory/2345/32323`
      );
    });
  });

  describe('getLoans', () => {
    it('get loans url', async () => {
      service.account = emptyAccount;

      const loanData = {
        outstandingLoan: {
          allLoanCount: 0,
          defaultedLoanBal: 0,
          defaultedLoanCount: 0,
          defaultedIntArrears: 0,
          genLoanCount: 0,
          eligEarlyPayoff: false,
          outstandLoanCount: 0,
          resLoanCount: 0,
          hardshipLoanCount: 0,
          totLoanBal: 0,
          totLoanPayment: 0,
          totLoanPrincipal: 0,
          monthlyAchPaymentCount: 0,
          outstandingLoanDtls: [],
        },
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(loanData));
      const result = await service.getLoan();
      expect(result).toEqual(loanData);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/rsdata/loans/outstanding/2345/32323`
      );
    });
  });

  describe('getRateOfReturn', () => {
    it('get rateOfreturn url', async () => {
      service.account = emptyAccount;
      const returnRate = {prr: {pct: 0, asofdate: ''}};
      baseServiceSpy.get.and.returnValue(Promise.resolve(returnRate));
      const result = await service.getRateOfReturn();
      expect(result).toEqual(returnRate);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/participation/history/prr/2345/32323`
      );
    });
  });

  describe('getPlanAdviceStatuses', () => {
    it('should call get plan advice statuses url', async () => {
      const data = {
        clients: [
          {
            id: 'client',
            domain: 'domain',
            plans: [
              {
                id: '13324',
                adviceStatus: 'FE_MANAGED',
              },
            ],
          },
        ],
      };

      service.account = emptyAccount;
      baseServiceSpy.get.and.returnValue(Promise.resolve(data));
      const result = await service.getPlanAdviceStatuses();
      expect(result).toEqual(data);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/rsdata/aboutme/plans/advicestatus`
      );
    });
  });

  describe('getOfferCode', () => {
    let dataval;
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      dataval = [
        {
          title: 'Organize Your $$$',
          offerCode: 'DIVMA',
          messageType: 'MESSAGE',
        },
        {title: 'Save More', offerCode: 'INCCONT', messageType: 'MESSAGE'},
        {
          title: 'Diversification',
          offerCode: 'MANACCT',
          messageType: 'MESSAGE',
        },
      ];
      baseServiceSpy.get.and.returnValue(Promise.resolve(dataval));
    });
    it('should call get offer code url', async () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      const result = await service.getOffercode();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/rsdata/accordion?s=' + 'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(dataval);
    });

    it('should return cached content when called twice', async () => {
      await service.getOffercode();
      const result = await service.getOffercode();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(result).toEqual(dataval);
    });
  });

  describe('getPredict', () => {
    const mockData = {
      OfferCodeAdviceJSON:
        '{"icon":"https://cdn1-originals.webdamdb.com/13947_134637265?cache=1655409017&response-content-disposition=inline;filename=speech%2520bubble%2520filled.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjY1P2NhY2hlPTE2NTU0MDkwMTcmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9c3BlZWNoJTI1MjBidWJibGUlMjUyMGZpbGxlZC5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=Ak8hETEvyxXRQb3iAOL10xVlWZbv6iu-1nhFiZVovbZldE5uRqEGs1pdQcdokzklw9Xc0me63HgWkCCIp~mE76YoNyP55-mFSyvIx4oFXkmqi1f9v1Ohhd2VuZtSe58IaafgTeJzEqhp-Erd9FFQGnw0odwMLVVNvWqdCrcYGbetKQu7ebRDnDzFId0Ze414glUBBsgM76OR0ooMYwTZxz5iwRMiUOeFBTQ1C~RdIZimufF~Ris-8s~184eBj2lxG~3uoH8voKi2309aBtWMvBVSGyQ6ftIc9-0ay4U~UwXyyFTWw0Prz0JoG2GFywik39Vs~CtT0DQT0UinyNeV4Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","MANACCT":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""},"FE":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""},"MANACTIPS":{"messages":["The right advice can make all the difference. Investing for retirement can be complicated. Fortunately, getting answers doesn\u2019t have to be. Consider personalized support from a professional."],"link_name":"Get Started","link_url":""}}',
    };
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
    });

    it('should return the OfferCodeAdviceJSON', async () => {
      spyOn(service, 'fetchPredictiveMessage').and.returnValue(observable);
      const result = await service.getPredict();
      expect(service.fetchPredictiveMessage).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(result).toEqual(JSON.parse(mockData.OfferCodeAdviceJSON));
    });

    it('should return the null when no OfferCodeAdviceJSON', async () => {
      spyOn(service, 'fetchPredictiveMessage').and.returnValue(of({}));
      const result = await service.getPredict();
      expect(result).toEqual(null);
    });
  });

  describe('getCarouselData', () => {
    const mockData = {
      OfferCodeJSON:
        '{"INCCONT":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637270?cache=1655409025&response-content-disposition=inline;filename=Lightbulb.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjcwP2NhY2hlPTE2NTU0MDkwMjUmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9TGlnaHRidWxiLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=Oy1pbAL3GCb~Os4BxOepirgSwwB6L49BhJIv4jXiEcOqaaTa3y0tchpfcXDw1xgx3b9n8KvpcA~P0l8OiDbzNrtUH5u11GBn12ZDxpMGaf4Gr~ZfFtJrER582vK3K1vIeNGTHbVzUZEInz~ykDYQE7mDphG5IClRpR9eHvaus2c3cWePZ9~kE9vJBRA5GG9is~AcvRxfEGCEV713pBoWUdkkJeO3VXPPIq65mvpDSo~NULo48GXSOOdhiou1K70NIfhxRGBcrSvRD3CMGQ-SI5yj22f1KgKm0LS8X-jQkLfyt2s3uAe0p5-ij12MfKYRLNLA-jI3-0sIDxKgtfBgMg__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"Saving 1% more today may make a difference for tomorrow","messages":["One penny on the dollar may not seem like a lot, but don’t forget that small changes can add up over time."],"link_name":"Learn More","link_url":""},"CATCHUP":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637272?cache=1655409027&response-content-disposition=inline;filename=Clock.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjcyP2NhY2hlPTE2NTU0MDkwMjcmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9Q2xvY2suc3ZnIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoyMTQ3NDE0NDAwfX19XX0_&Signature=nV2-AcQiWfHic~PKPaula4fHeoXxXionkJGLVP9~0kDmO2T32ENnQ0DaXOhjeOhrx0wJYXW6eto-3J3cD4u81rRow6pO6lqTa18-NjIPb-TG2eBI6DeVYSLGc8QYMh47B85S9l9TQMWq0NWayUHBLQCJX2625CnSNhjYEJZfN8zzV-W65sC7nXrPaw5kIlRbxR35lnfVD1SldH25aiysJqpm~GJ~YxO~-c2pFseXwIylEbGhLlqSCHRIZL8kd-sQ5k1Fqgnv4mRN1uWAGqiohu~mQ6PSCbq3WLpLRqTDWTaFR91ZUvZSjnNbKvLZjdF9bla2kc7PHo04DHzsSxN1gg__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"Need to make up for lost time? ","messages":["You are in the right place. Because you are eligible for catch-up contributions, you get to put away $6,500 more this year for retirement."],"link_name":"Learn More","link_url":""},"DIVERSE":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637274?cache=1655409032&response-content-disposition=inline;filename=Calendar%2520with%2520Check.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3Mjc0P2NhY2hlPTE2NTU0MDkwMzImcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9Q2FsZW5kYXIlMjUyMHdpdGglMjUyMENoZWNrLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=h3CgJ5Yomc-dr8nL8uWFSOjEalSD5aTAWTc~B-~Sbi0k~p9ZLuuLIHMuIiLUsCGWXBidRNrGqeiMZCHjcbfgGao6D5ksswz3CN6COmYtA5TtWB7H-9axXaBCrjj9UAAGoI2dz817MYz2VTzNafQsqFEq1t~6gybc1f946nM--PktZ60pU5rVaxnSMoLcaiJj0Bv~6rb0-pfb~Z9hYFm-HEDllv9m-f5n8ODzXcrffnGC3rhHJiVxWTjBtHI0Y8dHIR0zss3Zet5wJIqfYmC3PozkhWqfZuGsddNEdIuui4iT5qlFyW3ZjkHgaXUSC4hV7Ehkp3Z6Ydw-a-STy2wj5Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"The right mix today could mean the right retirement for tomorrow","messages":["Your investment elections might need some attention. Consider checking in to review your current selections to make sure you’re diversified."],"link_name":"Learn More","link_url":""},"DIVFE":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637274?cache=1655409032&response-content-disposition=inline;filename=Calendar%2520with%2520Check.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3Mjc0P2NhY2hlPTE2NTU0MDkwMzImcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9Q2FsZW5kYXIlMjUyMHdpdGglMjUyMENoZWNrLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=h3CgJ5Yomc-dr8nL8uWFSOjEalSD5aTAWTc~B-~Sbi0k~p9ZLuuLIHMuIiLUsCGWXBidRNrGqeiMZCHjcbfgGao6D5ksswz3CN6COmYtA5TtWB7H-9axXaBCrjj9UAAGoI2dz817MYz2VTzNafQsqFEq1t~6gybc1f946nM--PktZ60pU5rVaxnSMoLcaiJj0Bv~6rb0-pfb~Z9hYFm-HEDllv9m-f5n8ODzXcrffnGC3rhHJiVxWTjBtHI0Y8dHIR0zss3Zet5wJIqfYmC3PozkhWqfZuGsddNEdIuui4iT5qlFyW3ZjkHgaXUSC4hV7Ehkp3Z6Ydw-a-STy2wj5Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"How are you investing for tomorrow?","messages":["Make sure you have the right mix of investments in your retirement portfolio. Professional advice services can help you decide. Get Started"],"link_name":"Learn More","link_url":""},"DIVMA":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637274?cache=1655409032&response-content-disposition=inline;filename=Calendar%2520with%2520Check.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3Mjc0P2NhY2hlPTE2NTU0MDkwMzImcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9Q2FsZW5kYXIlMjUyMHdpdGglMjUyMENoZWNrLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=h3CgJ5Yomc-dr8nL8uWFSOjEalSD5aTAWTc~B-~Sbi0k~p9ZLuuLIHMuIiLUsCGWXBidRNrGqeiMZCHjcbfgGao6D5ksswz3CN6COmYtA5TtWB7H-9axXaBCrjj9UAAGoI2dz817MYz2VTzNafQsqFEq1t~6gybc1f946nM--PktZ60pU5rVaxnSMoLcaiJj0Bv~6rb0-pfb~Z9hYFm-HEDllv9m-f5n8ODzXcrffnGC3rhHJiVxWTjBtHI0Y8dHIR0zss3Zet5wJIqfYmC3PozkhWqfZuGsddNEdIuui4iT5qlFyW3ZjkHgaXUSC4hV7Ehkp3Z6Ydw-a-STy2wj5Q__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"How are you investing for tomorrow?","messages":["Make sure you have the right mix of investments in your retirement portfolio. Professional advice services can help you decide. Get Started"],"link_name":"Learn More","link_url":""},"RESAVING":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637269?cache=1655409022&response-content-disposition=inline;filename=Power.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjY5P2NhY2hlPTE2NTU0MDkwMjImcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UG93ZXIuc3ZnIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoyMTQ3NDE0NDAwfX19XX0_&Signature=KVMMw54KAS079xpgjkCsGnN5y~TaiF11UqNejr5AItTLb9VHGVSFLwpK60h3oZayUTN1csTaC8ODerb~rkR2IlIRLv-kfgqIbxyUMijMPmNvsg0k99sy~Vrdlkt-ch0q~eOnRCa8BNiMN04WBZ0ccsXP-tNdiWR273JYWeHk1WSVXZa67PyB-0f1x3bDwYvKfFarrlrjn2n0hc85aweWDy8kJwpRLXJF9X9~Jtd5RRaFxTgkbhWm8MLQ7BsmBrA9cT8SznASwwM0j890xRp-1diL1nPKsPZssJMTV~Pu3G6bHyPJ3i8FEoADRdRtJweYSn7801Yz~xhNUOMUxQevtg__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"Help get your retirement savings back on track","messages":["Life happens, and sometimes your financial future takes a back seat. We get it. Now’s the time to re-prioritize future you and get your retirement savings back on track."],"link_name":"Restart Your Savings","link_url":""},"ROLLIN":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637273?cache=1655409029&response-content-disposition=inline;filename=Check%2520Stack.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjczP2NhY2hlPTE2NTU0MDkwMjkmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9Q2hlY2slMjUyMFN0YWNrLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=GlhOuhfeUJri23mjXiud9geQ6w4gzzp8eJuj3BxWBnkJ-WHWoy6FrDknyrHqBXJdYIOILXU2Q~uyVTzF31STdGFr8AECdI7o3q3s94CfLHyTr~Ec4IwZTLX8Pb8ptTLiJIM40Yn4R-G9oM0rXeUbwgzXJD-agHURBBjbC4t1naNec~ENX0aI4PBvn928QEysPxbMSwsWfbfjuVnQGez23vh21ZQ8WmvY5wdHbGXXx37vXV6YqejCVkY9Y9ttIJVpHtipwIdVASC3OvHEBBmemz9JC47lHJ9pzv88wLKIm0H9XZkyhjOdzeLIHNs~3ZakSLjTi8yoUMLQAPqadIZcww__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"Thinking of consolidating your retirement accounts?","messages":["Your money might be simpler to manage when it’s together. Learn more about your options to decide if consolidating is right for you."],"link_name":"Learn More","link_url":""},"ROLLOVER":{"icon":"https://cdn1-originals.webdamdb.com/13947_134637268?cache=1655409020&response-content-disposition=inline;filename=Play.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTM0NjM3MjY4P2NhY2hlPTE2NTU0MDkwMjAmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UGxheS5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=ITF3J37WFIBK3RMSj1ZDRbClZrW2grA2Fd3QrPm5tlm9tI~x8thO-u41arBkd6~r-9eW8zTGAUQPd4nfXV1LtM~dVfeu8jTTzF~17SHKdVMQuusrXUchLb-TsVcgpx0~eN2YH2dUz~xwpGSCrtYpiAzwcDW7Z--0V8YgZf-KsslZ7SnqP-0FhillkIeD5dzfHVqXghnwWFYnmv~8fV0zBHRlCg5NRdKLtkBo8e~EBYS2LpC5RQbpK-I067dx7g4zNAcoSQX~BHxpCkGdETdhK6J19mEvom7ZKiM97K3srWba6EH9Zopvy-0252fqYrGf0iT1uSFcFgaDRF3S3DgCaw__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","title":"Is your retirement savings on pause?","messages":["Your money might be simpler to manage when it’s together. Learn more about your options to decide if rolling over your retirement savings is right for you."],"link_name":"Learn More","link_url":""}}',
    };
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
    });

    it('when return the actual data', async () => {
      spyOn(service, 'fetchPredictiveMessage').and.returnValue(observable);
      const result = await service.getCarouselData();
      expect(service.fetchPredictiveMessage).toHaveBeenCalled();
      expect(service['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(result).toEqual(JSON.parse(mockData.OfferCodeJSON));
    });

    it('when return the null data', async () => {
      spyOn(service, 'fetchPredictiveMessage').and.returnValue(of({}));
      const result = await service.getCarouselData();
      expect(result).toEqual(null);
    });
  });

  describe('fetchBalanceHistoryGraph', () => {
    let balanceHistoryGraph;
    beforeEach(() => {
      balanceHistoryGraph = {
        portfolioBalanceHistory: [
          {
            planName: 'New York City Deferred Compensation 457 Plan',
            planId: '626001',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '72277.76'],
          },
          {
            planName: 'New York City Deferred Compensation 457 Payout Account',
            planId: '626002',
            amounts: ['45000.0', '0.0', '0.0', '0.0', '12540.82'],
          },
        ],
        years: ['2018', '2019', '2020', '2021', 'Current'],
      };
    });
    it('should return balance history graph data if balanceHistoryGraphData undefined', async () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(balanceHistoryGraph));

      service.fetchBalanceHistoryGraph().subscribe(data => {
        expect(data).toEqual(balanceHistoryGraph);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/portfolioBalanceHistory'
        );
      });
    });
    it('should return balance history graph data if balanceHistoryGraphData defined', async () => {
      service['balanceHistoryGraphData'] = balanceHistoryGraph;

      service.fetchBalanceHistoryGraph();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });
  });

  describe('fetchPredictiveMessage', () => {
    const mockData = {
      OfferCodeJSON: '',
      OfferCodeAdviceJSON: '',
    };

    it('should call get to get the data if predictiveMessage is undefined', done => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      service['predictiveMessage'] = undefined;
      service.fetchPredictiveMessage().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual(mockData);
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(mockData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockData);
          return subscription;
        });
        baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      });

      it('should call get to get the data', done => {
        service['predictiveMessage'] = observable;
        service.fetchPredictiveMessage(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(mockData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if predictiveMessage is defined and refresh is false', () => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(mockData));
      service['predictiveMessage'] = of(mockData);
      const predictiveMessageSubjectSpy = jasmine.createSpyObj(
        'predictiveMessageSubjectSpy',
        ['']
      );
      service['predictiveMessage$'] = predictiveMessageSubjectSpy;
      const result = service.fetchPredictiveMessage();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(predictiveMessageSubjectSpy);
    });
  });

  describe('getContribution', () => {
    it('get Contribution url', async () => {
      service.account = emptyAccount;

      const contrib = {
        employersContribution: 0,
        employeeContribution: 0,
      };

      baseServiceSpy.get.and.returnValue(Promise.resolve(contrib));
      const result = await service.getContribution();
      expect(result).toEqual(contrib);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/participation/history/contributions/2345/32323`
      );
    });
  });

  describe('getYTDContribution', () => {
    it('get ytd Contribution url', async () => {
      service.account = emptyAccount;

      const ytdcontrib = {
        totalYTDContrib: '20.00',
        employeeContrib: 30.0,
        contribType: 'PCT',
        catchupType: 'PCT',
        puertoRicoResidentFlag: false,
        totalCatchup: 20.0,
      };

      baseServiceSpy.get.and.returnValue(Promise.resolve(ytdcontrib));
      const result = await service.getYTDContribution();
      expect(result).toEqual(ytdcontrib);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/contrib/paycontrib/2345/32323`
      );
    });
  });

  describe('getEmployersMatch', () => {
    it('get employers match url', async () => {
      service.account = emptyAccount;

      const employersmatch = {
        showMatch: false,
        matchPercentage: 22,
        nudgeType: 'COMPAREME',
        showMatchPercentageValue: true,
        icon: '',
        header: '',
        subHeader: '',
        urlText: '',
        url: '',
        actualEmployerMatch: 32,
        actualContributionPercentage: 32,
        peerComparisonContributionRate: 32,
        age: 32,
        toolTipText: '',
        toolTipNotes: '',
      };

      baseServiceSpy.get.and.returnValue(Promise.resolve(employersmatch));
      const result = await service.getEmployersMatch();
      expect(result).toEqual(employersmatch);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/display/message/employermatch/2345/32323`
      );
    });
  });

  describe('getTransaction', () => {
    let transact;
    beforeEach(() => {
      transact = {
        transactionHistories: [
          {
            tradeDate: '',
            type: '',
            tranCode: '',
            cash: 0,
            clientId: '',
            planId: '',
            participantId: '',
            unit_or_unshrs: '',
            br140_new_val_cash: '',
            br161_shr_price: '',
            br009_run_date: '',
            br011_seq_num: '',
            br980_ACT_NAME: '',
            br172_vouch_num: '',
          },
        ],
      };
    });

    it('should get hsa transactions if HSA account', async () => {
      spyOn(service, 'getHSATransactions').and.returnValue(
        Promise.resolve(transact)
      );
      service.account = transformedHsa;

      const result = await service.getTransaction();
      expect(service.getHSATransactions).toHaveBeenCalled();
      expect(result).toEqual(transact);
    });

    it('get ytd Transaction url', async () => {
      const today = new Date();
      const priorDate = moment(new Date().setDate(today.getDate() - 90)).format(
        'YYYY/MM/DD'
      );
      const currentDate = moment(Date.now()).format('YYYY/MM/DD');

      service.account = emptyAccount;

      baseServiceSpy.get.and.returnValue(Promise.resolve(transact));
      const result = await service.getTransaction();
      expect(result).toEqual(transact);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/participation/history/transactions/2345/32323?tranType=ALL&startDate=` +
          priorDate +
          '&endDate=' +
          currentDate
      );
    });
  });

  describe('getAccount', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(emptyAccount)
      );
    });
    it('return account', () => {
      service.account = emptyAccount;
      service.getAccount();
      expect(service.account).toEqual(emptyAccount);
    });
    it('return account when no data', () => {
      service['account'] = undefined;
      service.getAccount();
      expect(service.account).toEqual(emptyAccount);
    });
  });

  describe('openInAppBrowser', () => {
    it('open url in the system browser', async () => {
      const pweLink =
        'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710';
      service.openInAppBrowser(pweLink);
      expect(inAppBrowserSpy.openSystemBrowser).toHaveBeenCalledWith(pweLink);
    });
  });

  describe('getDividends', () => {
    it('return Dividend', async () => {
      service.account = emptyAccount;
      const contrib = {ytdDividend: 1231233};
      baseServiceSpy.get.and.returnValue(Promise.resolve(contrib));

      const result = await service.getDividends();
      expect(result).toEqual(contrib);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        `myvoyage/ws/ers/participation/history/dividend/2345/32323`
      );
    });
  });

  describe('setAccount', () => {
    it('return setaccount', () => {
      const accdata = emptyAccount;

      service.setAccount(accdata);
      expect(service.account).toBe(accdata);
    });
  });

  describe('getParticipant', () => {
    it('return participant', async () => {
      const participantData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(participantData));

      service.getParticipant().subscribe(data => {
        expect(data).toEqual(participantData);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/emvdata/profile'
        );
      });
    });

    it('return the existing participantData without calling get method', async () => {
      const participantData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };
      service['participantData'] = of(participantData);
      service.getParticipant();
      expect(baseServiceSpy.get).not.toHaveBeenCalledWith(
        'myvoya/ws/ers/data/customers/272c2587-6b79-d874-e053-d22aac0a0939/participantprofile?fromMDM=Y'
      );
    });
  });

  describe('setParticipant', () => {
    it('should update participant data subject', async () => {
      const participantSubjectSpy = jasmine.createSpyObj(
        'ReplaySubject<Participant>',
        ['next']
      );
      service['participantSubject'] = participantSubjectSpy;

      const participant = {} as Participant;
      service.setParticipant(participant);
      expect(participantSubjectSpy.next).toHaveBeenCalledWith(participant);
    });
  });

  describe('posNegSymbol', () => {
    it('should return blank for negative numbers', () => {
      const result = service.posNegSymbol(-1);
      expect(result).toEqual('');
    });

    it('should return + for negative numbers', () => {
      const result = service.posNegSymbol(1);
      expect(result).toEqual('+');
    });

    it('should return nothing for 0', () => {
      const result = service.posNegSymbol(0);
      expect(result).toEqual('');
    });
  });

  describe('getSelectedTab$', () => {
    it('should return the selectedTab$ subscriber', () => {
      service['selectedTab$'] = new Subject<string>();
      const result = service.getSelectedTab$();
      expect(result).toEqual(service['selectedTab$']);
    });
  });

  describe('publishSelectedTab', () => {
    it('should call next on the selectedTab subject', () => {
      service['selectedTab$'] = jasmine.createSpyObj('selectedTab$', ['next']);
      service.publishSelectedTab('selectedTab');
      expect(service['selectedTab$'].next).toHaveBeenCalledWith('selectedTab');
    });
  });

  describe('getAllAccounts', () => {
    beforeEach(() => {
      spyOn(service, 'getJSON').and.returnValue(
        Promise.resolve(emptyAccountsData)
      );
    });
    it('should call getJSON to get the data if allAccountData is undefined', done => {
      service['allAccountData'] = undefined;
      service.getAllAccounts().subscribe(data => {
        expect(service.getJSON).toHaveBeenCalled();
        expect(data).toEqual(emptyAccountsData);
        done();
      });
    });

    describe('if allAccountData is defined but refresh is true', () => {
      let observable;
      let subscription;
      beforeEach(
        waitForAsync(() => {
          observable = of(emptyAccountsData);
          subscription = new Subscription();
          spyOn(observable, 'subscribe').and.callFake(f => {
            f(emptyAccountsData);
            return subscription;
          });
        })
      );
      it('should call getJSON to get the data ', done => {
        service['allAccountData'] = observable;
        service.getAllAccounts(true).subscribe(data => {
          expect(service.getJSON).toHaveBeenCalled();
          expect(data).toEqual(emptyAccountsData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call getJSON to get the data if allAccountData is defined and refresh is false', () => {
      service['allAccountData'] = of(emptyAccountsData);
      const allAccountSubjecttSpy = jasmine.createSpyObj(
        'allAccountSubjecttSpy',
        ['']
      );
      service['allAccountSubject'] = allAccountSubjecttSpy;
      const result = service.getAllAccounts(false);
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(allAccountSubjecttSpy);
    });
  });

  describe('allAccountsWithoutHSA', () => {
    beforeEach(() => {
      spyOn(service, 'getAllAccountsWithOutHSA').and.returnValue(
        Promise.resolve(emptyAccountsData)
      );
    });
    it('should call getAllAccountsWithOutHSA to get the data if allAccountsWithoutHSAData is undefined', done => {
      service['allAccountsWithoutHSAData'] = undefined;
      service.allAccountsWithoutHSA().subscribe(data => {
        expect(service.getAllAccountsWithOutHSA).toHaveBeenCalled();
        expect(data).toEqual(emptyAccountsData);
        done();
      });
    });

    describe('if allAccountsWithoutHSAData is defined but refresh is true', () => {
      let observable;
      let subscription;
      beforeEach(
        waitForAsync(() => {
          observable = of(emptyAccountsData);
          subscription = new Subscription();
          spyOn(observable, 'subscribe').and.callFake(f => {
            f(emptyAccountsData);
            return subscription;
          });
        })
      );
      it('should call getAllAccountsWithOutHSA to get the data ', done => {
        service['allAccountsWithoutHSAData'] = observable;
        service.allAccountsWithoutHSA(true).subscribe(data => {
          expect(service.getAllAccountsWithOutHSA).toHaveBeenCalled();
          expect(data).toEqual(emptyAccountsData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call getAllAccountsWithOutHSA to get the data if allAccountsWithoutHSAData is defined and refresh is false', () => {
      service['allAccountsWithoutHSAData'] = of(emptyAccountsData);
      const allAccountSubjecttSpy = jasmine.createSpyObj(
        'allAccountSubjecttSpy',
        ['']
      );
      service['allAccountsWithoutHSASubject'] = allAccountSubjecttSpy;
      const result = service.allAccountsWithoutHSA(false);
      expect(service.getAllAccountsWithOutHSA).not.toHaveBeenCalled();
      expect(result).toEqual(allAccountSubjecttSpy);
    });
  });

  describe('allAccountsWithHSA', () => {
    beforeEach(() => {
      spyOn(service, 'getOnlyWithHSAAccount').and.returnValue(
        Promise.resolve(emptyAccountsData)
      );
    });
    it('should call getOnlyWithHSAAccount to get the data if allAccountsWithHSAData is undefined', done => {
      service['allAccountsWithHSAData'] = undefined;
      service.allAccountsWithHSA().subscribe(data => {
        expect(service.getOnlyWithHSAAccount).toHaveBeenCalled();
        expect(data).toEqual(emptyAccountsData);
        done();
      });
    });

    describe('if allAccountsWithHSAData is defined but refresh is true', () => {
      let observable;
      let subscription;
      beforeEach(
        waitForAsync(() => {
          observable = of(emptyAccountsData);
          subscription = new Subscription();
          spyOn(observable, 'subscribe').and.callFake(f => {
            f(emptyAccountsData);
            return subscription;
          });
        })
      );
      it('should call getOnlyWithHSAAccount to get the data ', done => {
        service['allAccountsWithHSAData'] = observable;
        service.allAccountsWithHSA(true).subscribe(data => {
          expect(service.getOnlyWithHSAAccount).toHaveBeenCalled();
          expect(data).toEqual(emptyAccountsData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call getOnlyWithHSAAccount to get the data if onlyHSAAccountData is defined and refresh is false', () => {
      service['allAccountsWithHSAData'] = of(emptyAccountsData);
      const allAccountSubjecttSpy = jasmine.createSpyObj(
        'allAccountSubjecttSpy',
        ['']
      );
      service['allAccountsWithHSASubject'] = allAccountSubjecttSpy;
      const result = service.allAccountsWithHSA(false);
      expect(service.getOnlyWithHSAAccount).not.toHaveBeenCalled();
      expect(result).toEqual(allAccountSubjecttSpy);
    });
  });

  describe('getAccountDataBasedOnType', () => {
    beforeEach(() => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of(emptyAccountsData)
      );
    });
    it('When refresh would be false', done => {
      service
        .getAccountDataBasedOnType('32323', 'retirementAccounts')
        .subscribe(data => {
          expect(data).toEqual(emptyAccount);
          expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(false);
          done();
        });
    });
  });

  describe('getNonHSAAccountDataWithoutType', () => {
    it('for retirementAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [emptyAccount],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [],
          },
        })
      );
      service.getNonHSAAccountDataWithoutType('32323').subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(false);
        done();
      });
    });
    it('for vendorAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [],
          },
          vendorAccounts: {
            accounts: [emptyAccount],
          },
          stockAccounts: {
            accounts: [],
          },
        })
      );
      service.getNonHSAAccountDataWithoutType('32323', true).subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(true);
        done();
      });
    });
    it('for stockAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [emptyAccount],
          },
        })
      );
      service.getNonHSAAccountDataWithoutType('32323', true).subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(true);
        done();
      });
    });
    it('for brokerageAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [],
          },
          brokerageAccounts: {
            accounts: [emptyAccount],
          },
          hsaAccounts: {
            accounts: [],
          },
        })
      );
      service.getNonHSAAccountDataWithoutType('32323', true).subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(true);
        done();
      });
    });
  });

  describe('getAccountDataWithoutType', () => {
    beforeEach(() => {
      spyOn(service, 'allAccountsWithHSA').and.returnValue(
        of({
          hsaAccounts: {
            accounts: [emptyAccount],
          },
        })
      );
    });
    it('for non hsa accounts', done => {
      spyOn(service, 'getNonHSAAccountDataWithoutType').and.returnValue(
        of(emptyAccount)
      );
      service.getAccountDataWithoutType('32323').subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.getNonHSAAccountDataWithoutType).toHaveBeenCalled();
        expect(service.allAccountsWithHSA).not.toHaveBeenCalled();
        done();
      });
    });
    it('for hsa accounts', done => {
      spyOn(service, 'getNonHSAAccountDataWithoutType').and.returnValue(
        of(undefined)
      );
      service.getAccountDataWithoutType('32323').subscribe(data => {
        expect(data).toEqual(emptyAccount);
        expect(service.getNonHSAAccountDataWithoutType).toHaveBeenCalled();
        expect(service.allAccountsWithHSA).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('filterIsVoyaAccessPlanAccountData', () => {
    it('should return data', () => {
      const result = service['filterIsVoyaAccessPlanAccountData'](
        {
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [voyaAccessPlanAcct],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [],
          },
        },
        'retirementAccounts',
        '32323',
        '56'
      );
      expect(result).toEqual(voyaAccessPlanAcct);
    });
  });

  describe('getIsVoyaAccessPlanAccountData', () => {
    beforeEach(() => {
      service[
        'filterIsVoyaAccessPlanAccountData'
      ] = jasmine.createSpy().and.returnValue(voyaAccessPlanAcct);
    });
    it('for retirementAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [voyaAccessPlanAcct],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [],
          },
        })
      );
      service.getIsVoyaAccessPlanAccountData('32323', '56').subscribe(data => {
        expect(data).toEqual(voyaAccessPlanAcct);
        expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(false);
        expect(
          service['filterIsVoyaAccessPlanAccountData']
        ).toHaveBeenCalledWith(
          {
            retirementAccounts: {
              dataStatus: 'OK',
              errorCode: 'NO_ERROR',
              accounts: [voyaAccessPlanAcct],
            },
            vendorAccounts: {
              accounts: [],
            },
            stockAccounts: {
              accounts: [],
            },
          },
          'retirementAccounts',
          '32323',
          '56'
        );
        done();
      });
    });
    it('for vendorAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [],
          },
          vendorAccounts: {
            accounts: [voyaAccessPlanAcct],
          },
          stockAccounts: {
            accounts: [],
          },
        })
      );
      service
        .getIsVoyaAccessPlanAccountData('32323', '56', true)
        .subscribe(data => {
          expect(data).toEqual(voyaAccessPlanAcct);
          expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(true);
          expect(
            service['filterIsVoyaAccessPlanAccountData']
          ).toHaveBeenCalled();
          done();
        });
    });
    it('for stockAccounts', done => {
      spyOn(service, 'allAccountsWithoutHSA').and.returnValue(
        of({
          retirementAccounts: {
            dataStatus: 'OK',
            errorCode: 'NO_ERROR',
            accounts: [],
          },
          vendorAccounts: {
            accounts: [],
          },
          stockAccounts: {
            accounts: [voyaAccessPlanAcct],
          },
        })
      );
      service
        .getIsVoyaAccessPlanAccountData('32323', '56', true)
        .subscribe(data => {
          expect(data).toEqual(voyaAccessPlanAcct);
          expect(service.allAccountsWithoutHSA).toHaveBeenCalledWith(true);
          expect(
            service['filterIsVoyaAccessPlanAccountData']
          ).toHaveBeenCalled();
          done();
        });
    });
  });

  describe('openPwebAccountLink', () => {
    const link =
      'https://login.intg.voya.com/saml/sps/saml-idp-login/saml20/logininitial?PartnerId=https://my3.intg.voya.com/mga/sps/saml-sp-my-local/saml20&access_token=[exchanged_access_token]&Target=https://my3.intg.voya.com/voyasso/mobileSignOn?domain=kohler.intg.voya.com&target=https://my3.intg.voya.com/myvoyaui/index.html#my-profile/login-info';
    describe('when isWeb would be false', () => {
      let accessToken;
      let queryAccessTokenResponse: QueryAccessToken;
      let mockLoader;
      let encodedLink;
      beforeEach(() => {
        utilityServiceSpy.getIsWeb.and.returnValue(false);
        encodedLink = 'http://www.encoded.link/test';

        accessToken = 'accessToken';
        authServiceSpy.getAccessToken.and.returnValue(
          Promise.resolve(accessToken)
        );
        queryAccessTokenResponse = {
          access_token: 'access_token',
        };
        baseServiceSpy.postUrlEncoded.and.returnValue(
          Promise.resolve(queryAccessTokenResponse)
        );
        mockLoader = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
        loadingControllerSpy.create.and.returnValue(
          Promise.resolve(mockLoader)
        );
        service['encodePwebAccountLink'] = jasmine
          .createSpy()
          .and.returnValue(encodedLink);
      });

      it('should show the loader', async () => {
        await service.openPwebAccountLink(link);
        expect(loadingControllerSpy.create).toHaveBeenCalledWith({
          translucent: true,
        });
        expect(mockLoader.present).toHaveBeenCalled();
      });

      it('should get the access token from authService', async () => {
        await service.openPwebAccountLink(link);
        expect(authServiceSpy.getAccessToken).toHaveBeenCalled();
      });

      it('should call baseService postUrlEncoded to get the query access token', async () => {
        await service.openPwebAccountLink(link);
        expect(baseServiceSpy.postUrlEncoded).toHaveBeenCalledWith(
          'http://token.test.com/oidcop/sps/oauth/oauth20/token',
          {
            client_id: 'token_client',
            subject_token: accessToken,
            subject_token_type: 'access_token',
            audience:
              'http://login.test.com/saml/sps/saml-idp-logintest/saml20',
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            requested_token_type: 'access_token',
            scope: 'urn:voya:federation',
          },
          {}
        );
      });

      it('should open an in app browser with the query access token', async () => {
        await service.openPwebAccountLink(link);
        expect(inAppBrowserSpy.openSystemBrowser).toHaveBeenCalledWith(
          encodedLink
        );
      });

      it('should call encodeLink to get the proper link to call', async () => {
        await service.openPwebAccountLink(link);
        expect(service['encodePwebAccountLink']).toHaveBeenCalledWith(
          link,
          'access_token'
        );
      });
    });
    describe('when isWeb would be true', () => {
      beforeEach(() => {
        spyOn(window, 'open');
        utilityServiceSpy.getIsWeb.and.returnValue(true);
      });
      it('should call window.open', async () => {
        await service.openPwebAccountLink(link);
        expect(window.open).toHaveBeenCalledWith(link, '_blank');
      });
    });
  });

  describe('setAccountLocalStorage', () => {
    it('should call setAccountLocalStorage', async () => {
      spyOn(service, 'setAccount');
      service.previousAcctInLocalStorage = undefined;
      const emptyData = {
        accountBalance: '',
        accountBalanceAsOf: '',
        accountNumber: '',
        accountTitle: '',
        accountType: '',
        accountOpenDate: '',
        suppressTab: false,
        planLink: '',
        mediumLogoUrl: '',
        smallLogoUrl: '',
        bodyText: '',
        buttonText: '',
        ebooksLink: {
          label: '',
          url: '',
        },
        sourceSystem: '',
        voyaSavings: '',
        includedInOrangeMoney: false,
        accountAllowedForMyVoya: false,
        clientId: '',
        planId: '',
        planType: '',
        needOMAutomaticUpdate: false,
        planName: '',
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
      };
      service.setAccountLocalStorage(emptyData);
      expect(service.previousAcctInLocalStorage).toEqual(emptyData);
    });

    it('should not call setAccount when data in cache', async () => {
      spyOn(service, 'setAccount');
      const emptyData = {
        accountBalance: '',
        accountBalanceAsOf: '',
        accountNumber: '',
        accountTitle: '',
        accountType: '',
        accountOpenDate: '',
        suppressTab: false,
        planLink: '',
        mediumLogoUrl: '',
        smallLogoUrl: '',
        bodyText: '',
        buttonText: '',
        ebooksLink: {
          label: '',
          url: '',
        },
        sourceSystem: '',
        voyaSavings: '',
        includedInOrangeMoney: false,
        accountAllowedForMyVoya: false,
        clientId: '',
        planId: '',
        planType: '',
        needOMAutomaticUpdate: false,
        planName: '',
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
      };
      service.previousAcctInLocalStorage = emptyData;
      service.setAccountLocalStorage(emptyData);
      expect(service.setAccount).not.toHaveBeenCalledWith(emptyData);
    });
  });

  describe('getAccountLocalStorage', () => {
    const emptyData = {
      accountBalance: '',
      accountBalanceAsOf: '',
      accountNumber: '',
      accountTitle: '',
      accountType: '',
      accountOpenDate: '',
      suppressTab: false,
      planLink: '',
      mediumLogoUrl: '',
      smallLogoUrl: '',
      bodyText: '',
      buttonText: '',
      ebooksLink: {
        label: '',
        url: '',
      },
      sourceSystem: '',
      voyaSavings: '',
      includedInOrangeMoney: false,
      accountAllowedForMyVoya: false,
      clientId: '',
      planId: '',
      planType: '',
      needOMAutomaticUpdate: false,
      planName: '',
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
    };
    it('should fetch the account data', done => {
      service['accountLocalStorageSubject'].next(emptyData);
      service.getAccountLocalStorage().subscribe(data => {
        expect(data).toEqual(emptyData);
        done();
      });
    });
  });

  describe('encodePwebAccountLink', () => {
    it('should return the link encoded with the access token', () => {
      const result = service['encodePwebAccountLink'](
        'https://test.com?aaa=bbb&ccc=ddd',
        '12345'
      );
      expect(result).toEqual(
        'mga/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:login_access_token_querystring&access_token=12345&URL=https%3A%2F%2Ftest.com%3Faaa%3Dbbb%26ccc%3Dddd'
      );
    });
  });

  describe('transformHSAAccount', () => {
    it('should transform hsa account object into Account object', () => {
      const result = service.transformHSAAccount(hsaAccount);
      expect(result).toEqual(transformedHsa);
    });

    it('should transform hsa account object into Account object with accountBalance = available not returned from accountBalances for non hsa', () => {
      const result = service.transformHSAAccount(hsaAccountNonHSA);
      expect(result).toEqual(transformedHsaNonHSA);
    });
  });

  describe('getHSAAccounts', () => {
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('test_session_id')
      );
    });
    it('should call baseService.get and transform each HSA to Account', async () => {
      spyOn(service, 'transformHSAAccount').and.returnValue(transformedHsa);

      baseServiceSpy.get.and.returnValue(
        Promise.resolve({
          Status: 'success',
          AllAccountsBalance: [hsaAccount],
        })
      );

      const result = await service.getHSAAccounts();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(service.transformHSAAccount).toHaveBeenCalledWith(hsaAccount);
      expect(result).toEqual({
        dataStatus: 'success',
        errorCode: '',
        accounts: [transformedHsa],
      });
    });

    it('should call baseService.get return empty if error', async () => {
      spyOn(service, 'transformHSAAccount').and.returnValue(transformedHsa);
      baseServiceSpy.get.and.returnValue(Promise.resolve(null));

      const result = await service.getHSAAccounts();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(service.transformHSAAccount).not.toHaveBeenCalledWith(hsaAccount);
      expect(result).toEqual({
        dataStatus: 'failed',
        errorCode: '',
        accounts: [],
      });
    });
  });

  describe('transformHSATransaction', () => {
    it('should transform hsa transaction object into TransactionHistory object', () => {
      const result = service.transformHSATransaction(hsaTransaction);
      expect(result).toEqual(transformedHsaTransaction);
    });
  });

  describe('getHSATransactions', () => {
    it('should call baseService.get and transform each HSATransactions to TransactionHistories', async () => {
      service.account = transformedHsa;
      spyOn(service, 'transformHSATransaction').and.returnValue(
        transformedHsaTransaction
      );

      baseServiceSpy.get.and.returnValue(
        Promise.resolve({
          Status: 'success',
          AllAccountsTransactions: [hsaTransaction],
        })
      );

      const result = await service.getHSATransactions();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.hsaTransactions +
          hsaAccount.HAS_PARTY_ID +
          '/' +
          hsaAccount.Plan_ID
      );
      expect(service.transformHSATransaction).toHaveBeenCalledWith(
        hsaTransaction
      );
      expect(result).toEqual({
        transactionHistories: [transformedHsaTransaction],
      });
    });
  });

  describe('getDisplayNameOrFirst', () => {
    it('should return first name if display name is undefined', () => {
      const part = {
        firstName: 'test',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirst(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return first name if display name is empty', () => {
      const part = {
        firstName: 'test',
        displayName: '',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirst(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return first name if display name is equal to lastName, firstName', () => {
      const part = {
        firstName: 'test',
        lastName: 'last',
        displayName: 'last, test',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirst(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return first name if display name is equal to lastName, firstName ignoring case', () => {
      const part = {
        firstName: 'TEST',
        lastName: 'lasT',
        displayName: 'last, test',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirst(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return display name if display name is not null, not empty, and not equal to lastName, firstName', () => {
      const part = {
        firstName: 'test',
        lastName: 'last',
        displayName: 'test display name',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirst(part);
      expect(reuslt).toEqual(part.displayName);
    });
  });

  describe('getDisplayNameOrFirstOrLast', () => {
    it('should return fistname name if first and last name is equal to display name', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return display name if first and last name is not equal to display name', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: 'Test, New App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should return last name if first and display names are empty or null', () => {
      const part = {
        firstName: '',
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: '',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.lastName);
    });

    it('should return display name if first name is undefined and comination of first and last name is not equal to display name', () => {
      const part = {
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should return display name if lastname name is undefined and comination of first and last name is not equal to display name', () => {
      const part = {
        firstName: 'Test',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should return first name if display name is undefined', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        birthDate: '10/19/1952',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.firstName);
    });

    it('should return first name if display name is not contains comma', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        displayName: 'TEST APP',
        birthDate: '10/19/1952',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstOrLast(part);
      expect(reuslt).toEqual(part.firstName);
    });
  });

  describe('getDisplayNameOrFirstLast', () => {
    it('should the first and last name if first and last name is equal to display name', () => {
      const part = {
        firstName: 'Test',
        lastName: 'New App',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should the display name if first and last name is not equal to display name', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstLast(part);
      expect(reuslt).toEqual(part.firstName + ' ' + part.lastName);
    });

    it('should return display name if first name is undefined and comination of first and last name is not equal to display name', () => {
      const part = {
        lastName: 'App',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should return display name if lastname name is undefined and comination of first and last name is not equal to display name', () => {
      const part = {
        firstName: 'Test',
        birthDate: '10/19/1952',
        displayName: 'Test, App',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstLast(part);
      expect(reuslt).toEqual(part.displayName);
    });

    it('should return first and last name if display name is undefined', () => {
      const part = {
        firstName: 'Test',
        lastName: 'App',
        birthDate: '10/19/1952',
        age: '69',
        profileId: '70d42968-3cc5-7e9b-e053-2cd8ac0ab765',
      } as Participant;

      const reuslt = service.getDisplayNameOrFirstLast(part);
      expect(reuslt).toEqual(part.firstName + ' ' + part.lastName);
    });
  });

  describe('changeSort', () => {
    it('should call next on the changeSort subject', () => {
      service['sort'] = jasmine.createSpyObj('sort', ['next']);
      service.changeSort('data');
      expect(service['sort'].next).toHaveBeenCalledWith('data');
    });
  });

  describe('currentSort', () => {
    it('should fetch data', done => {
      service['sort'].next('hello');
      service.currentSort().subscribe(data => {
        expect(data).toEqual('hello');
        done();
      });
    });
  });

  describe('setFiltSlcted', () => {
    it('should set the selectd filter in local storage', () => {
      spyOn(Storage.prototype, 'setItem');
      service.setFiltSlcted(storedFilterKey);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'storedFilterKey',
        JSON.stringify(storedFilterKey)
      );
      expect(service['storedFilterKey']).toEqual(storedFilterKey);
    });
  });

  describe('getFiltSlcted', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(storedFilterKey)
      );
    });
    it('should return the storedFilterKey if without going to local storage if it is set', () => {
      service['storedFilterKey'] = storedFilterKey;
      const result = service.getFiltSlcted();
      expect(result).toEqual(storedFilterKey);
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    });
    it('should get the storedFilterKey from local storage if it is not set', () => {
      service['storedFilterKey'] = undefined;
      const result = service.getFiltSlcted();
      expect(result).toEqual(JSON.parse(JSON.stringify(storedFilterKey)));
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('storedFilterKey');
    });
  });

  describe('changeFilt', () => {
    const data = [
      {
        label: 'Transaction Filter ',
        values: [
          {name: 'TestData 1', key: '1'},
          {name: 'TestData 2', key: '2'},
        ],
      },
    ] as FilterList[];

    it('should call next on the changeFilt subject', () => {
      service['filt'] = jasmine.createSpyObj('filt', ['next']);
      service.changeFilt(data);
      expect(service['filt'].next).toHaveBeenCalledWith(data);
    });
  });

  describe('setSortSlcted', () => {
    it('should set the selectd filter in local storage', () => {
      spyOn(Storage.prototype, 'setItem');
      service.setSortSlcted(storedSortKey);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'storedSortKey',
        JSON.stringify(storedSortKey)
      );
      expect(service['storedSortKey']).toEqual(storedSortKey);
    });
  });

  describe('getSortSlcted', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(storedSortKey)
      );
    });
    it('should return the storedSortKey if without going to local storage if it is set', () => {
      service['storedSortKey'] = storedSortKey;
      const result = service.getSortSlcted();
      expect(result).toEqual(storedSortKey);
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
    });
    it('should get the storedSortKey from local storage if it is not set', () => {
      service['storedSortKey'] = undefined;
      const result = service.getSortSlcted();
      expect(result).toEqual(JSON.parse(JSON.stringify(storedSortKey)));
      expect(Storage.prototype.getItem).toHaveBeenCalledWith('storedSortKey');
    });
  });

  describe('getMoneyOutStatusDetails', () => {
    let moneyOutDetails;
    beforeEach(() => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        'Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      moneyOutDetails = {
        clientDetails: [
          {
            clientId: 'ADPTTL',
            clientPlanTransactions: [
              {
                planId: '894550',
                details: {
                  item: {
                    clientType: 'IPS',
                    moneyoutTotalCount: '1',
                    moneyoutLoanCount: '0',
                    moneyoutWithdrawalCount: '1',
                    paymentStopped: 'false',
                    moneyoutComposite: 'false',
                    notepadAttached: null,
                  },
                  transactionList: [
                    {
                      checkCashDate: '',
                      currentStatus: 'PPT_PREPARE_PAYMENT',
                      deliveryMaxDate: '',
                      deliveryRange: '5 to 7',
                      directDepositDate: '',
                      moneyOutDeliveryMethod: 'check',
                      moneyOutSubType: 'hardship withdrawal',
                      moneyOutType: 'WITHDRAWAL',
                      netCheckAmount: 'USD2,000.00',
                      netCheckAmountSource: 'OLTP',
                      taskId: 't211228000i',
                      transactionDate: '2021-12-28',
                      transactionCompletionDate: '',
                      upsTrackingAvailable: 'false',
                      upsTrackingNumber: '',
                      moneyOutMessage:
                        'Good news! Your hardship withdrawal requested on 12/28/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.',
                      transactionIdentifier: '4325113',
                    },
                  ],
                  moneyOutEnabledInSetIt: true,
                },
              },
            ],
          },
          {
            clientId: 'ABRA',
            clientPlanTransactions: [
              {
                planId: '362552',
                details: {
                  item: {
                    clientType: 'IPS',
                    moneyoutTotalCount: '1',
                    moneyoutLoanCount: '0',
                    moneyoutWithdrawalCount: '1',
                    paymentStopped: 'false',
                    moneyoutComposite: 'false',
                    notepadAttached: null,
                  },
                  transactionList: [
                    {
                      checkCashDate: '',
                      currentStatus: 'PPT_PREPARE_PAYMENT',
                      deliveryMaxDate: '',
                      deliveryRange: '5 to 7',
                      directDepositDate: '',
                      moneyOutDeliveryMethod: 'check',
                      moneyOutSubType: 'hardship withdrawal',
                      moneyOutType: 'WITHDRAWAL',
                      netCheckAmount: 'USD2,000.00',
                      netCheckAmountSource: 'OLTP',
                      taskId: 't211228000i',
                      transactionDate: '2021-12-28',
                      transactionCompletionDate: '',
                      upsTrackingAvailable: 'false',
                      upsTrackingNumber: '',
                      moneyOutMessage:
                        'Good news! Your hardship withdrawal requested on 12/29/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.',
                      transactionIdentifier: '4325113',
                    },
                  ],
                  moneyOutEnabledInSetIt: true,
                },
              },
            ],
          },
        ],
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(moneyOutDetails));
    });

    it('should fetch data', async () => {
      const result = await service['getMoneyOutStatusDetails']();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/moneyouttranscations?s=Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(moneyOutDetails);
    });
  });

  describe('getMoneyOutStatus', () => {
    let moneyOutStatusDetails;
    beforeEach(() => {
      moneyOutStatusDetails = {
        clientDetails: [
          {
            clientId: 'ADPTTL',
            clientPlanTransactions: [
              {
                planId: '894550',
                details: {
                  item: {
                    clientType: 'IPS',
                    moneyoutTotalCount: '1',
                    moneyoutLoanCount: '0',
                    moneyoutWithdrawalCount: '1',
                    paymentStopped: 'false',
                    moneyoutComposite: 'false',
                    notepadAttached: null,
                  },
                  transactionList: [
                    {
                      checkCashDate: '',
                      currentStatus: 'PPT_PREPARE_PAYMENT',
                      deliveryMaxDate: '',
                      deliveryRange: '5 to 7',
                      directDepositDate: '',
                      moneyOutDeliveryMethod: 'check',
                      moneyOutSubType: 'hardship withdrawal',
                      moneyOutType: 'WITHDRAWAL',
                      netCheckAmount: 'USD2,000.00',
                      netCheckAmountSource: 'OLTP',
                      taskId: 't211228000i',
                      transactionDate: '2021-12-28',
                      transactionCompletionDate: '',
                      upsTrackingAvailable: 'false',
                      upsTrackingNumber: '',
                      moneyOutMessage:
                        'Good news! Your hardship withdrawal requested on 12/28/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.',
                      transactionIdentifier: '4325113',
                    },
                  ],
                  moneyOutEnabledInSetIt: true,
                },
              },
            ],
          },
          {
            clientId: 'ABRA',
            clientPlanTransactions: [
              {
                planId: '362552',
                details: {
                  item: {
                    clientType: 'IPS',
                    moneyoutTotalCount: '1',
                    moneyoutLoanCount: '0',
                    moneyoutWithdrawalCount: '1',
                    paymentStopped: 'false',
                    moneyoutComposite: 'false',
                    notepadAttached: null,
                  },
                  transactionList: [
                    {
                      checkCashDate: '',
                      currentStatus: 'PPT_PREPARE_PAYMENT',
                      deliveryMaxDate: '',
                      deliveryRange: '5 to 7',
                      directDepositDate: '',
                      moneyOutDeliveryMethod: 'check',
                      moneyOutSubType: 'hardship withdrawal',
                      moneyOutType: 'WITHDRAWAL',
                      netCheckAmount: 'USD2,000.00',
                      netCheckAmountSource: 'OLTP',
                      taskId: 't211228000i',
                      transactionDate: '2021-12-28',
                      transactionCompletionDate: '',
                      upsTrackingAvailable: 'false',
                      upsTrackingNumber: '',
                      moneyOutMessage:
                        'Good news! Your hardship withdrawal requested on 12/29/2021 for $2,000.00 has been processed. We are currently preparing your payment for delivery. Once complete, you should receive your payment via check within 5 to 7 business days.',
                      transactionIdentifier: '4325113',
                    },
                  ],
                  moneyOutEnabledInSetIt: true,
                },
              },
            ],
          },
        ],
      };
    });

    it('when moneyOutData is undefined', async () => {
      service['getMoneyOutStatusDetails'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(moneyOutStatusDetails));
      service['moneyOutData'] = undefined;
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(moneyOutStatusDetails)
      );
      service.getMoneyOutStatus().subscribe(data => {
        expect(data).toEqual(moneyOutStatusDetails);
      });
    });

    it('if refresh will be true', async () => {
      service['getMoneyOutStatusDetails'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(moneyOutStatusDetails));
      service['moneyOutData'] = moneyOutStatusDetails;
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(moneyOutStatusDetails)
      );
      service.getMoneyOutStatus(true).subscribe(data => {
        expect(data).toEqual(moneyOutStatusDetails);
        expect(service['getMoneyOutStatusDetails']).toHaveBeenCalled();
      });
    });

    it('should not call getMoneyOutStatusDetails get if data is already set', async () => {
      service['moneyOutData'] = of(moneyOutStatusDetails);
      const moneyOutDataSubjectSpy = jasmine.createSpyObj(
        'moneyOutDataSubjectSpy',
        ['']
      );
      service['moneyOutDataSubject'] = moneyOutDataSubjectSpy;
      const result = service.getMoneyOutStatus();
      expect(result).toEqual(moneyOutDataSubjectSpy);
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
