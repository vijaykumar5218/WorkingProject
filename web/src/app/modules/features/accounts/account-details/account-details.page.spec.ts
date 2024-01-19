import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AccountDeatilsPage} from './account-details.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {of, Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {AccessService} from '@shared-lib/services/access/access.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

describe('AccountDetailsPage', () => {
  let component: AccountDeatilsPage;
  let fixture: ComponentFixture<AccountDeatilsPage>;
  let accountServiceSpy;
  let utilityServiceSpy;
  let publisherSpy;
  let eventManagerServiceSpy;
  let accessServiceSpy;
  const mockMyvoyageAccessData: any = {
    isMxUser: true,
  };
  let mxServiceSpy;

  const emptyAccount: Account = {
    agreementId: '',
    accountTitle: '',
    accountBalance: '',
    accountBalanceAsOf: '',
    sourceSystem: 'EASE',
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
    planLink: 'planLink',
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

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkWorkplaceAccess',
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
        'openPwebAccountLink',
        'getMultiClientBlockModal',
        'getAccountLocalStorage',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'fetchUrlThroughNavigation',
      ]);
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createPublisher',
      ]);

      publisherSpy = jasmine.createSpyObj('Publisher', ['publish']);
      eventManagerServiceSpy.createPublisher.and.returnValue(publisherSpy);

      TestBed.configureTestingModule({
        declarations: [AccountDeatilsPage],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeatilsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(true);
      spyOn(component.subscription, 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(observable);
    });
    it('should call createPublisher', () => {
      component.ngOnInit();
      expect(eventManagerServiceSpy.createPublisher).toHaveBeenCalledWith(
        eventKeys.refreshAccountInfo
      );
    });
    it('should call getIsMxUserByMyvoyageAccess & set the value of isMXUser', () => {
      component.ngOnInit();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.isMxUser).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('ionViewWillEnter', () => {
    let fetchPlanIdObservable;
    let fetchPlanIdSubscription;
    let mockData;
    beforeEach(() => {
      mockData = {
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      };
      fetchPlanIdObservable = of(mockData);
      fetchPlanIdSubscription = new Subscription();
      spyOn(fetchPlanIdObservable, 'subscribe').and.callFake(f => {
        f(mockData);
        return fetchPlanIdSubscription;
      });
      spyOn(component.subscription, 'add');
      spyOn(component, 'fetchAcct');
      utilityServiceSpy.fetchUrlThroughNavigation.and.returnValue(
        fetchPlanIdObservable
      );
    });
    it('should call fetchAcct', () => {
      component.ionViewWillEnter();
      expect(component.fetchAcct).toHaveBeenCalledOnceWith(mockData);
      expect(component.isRoutingActive).toEqual(false);
      expect(component.subscription.add).toHaveBeenCalledWith(
        fetchPlanIdSubscription
      );
      expect(utilityServiceSpy.fetchUrlThroughNavigation).toHaveBeenCalledWith(
        3
      );
    });
  });

  describe('fetchAcct', () => {
    beforeEach(() => {
      spyOn(component, 'manageGoToAccountButton');
      component.isRoutingActive = false;
      component.selectedTab = undefined;
    });
    it('should publish event', () => {
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      });
      expect(publisherSpy.publish).toHaveBeenCalledWith(undefined);
      expect(accountServiceSpy.getAccountLocalStorage).toHaveBeenCalled();
    });
    it('should not publish event', () => {
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/transactions',
      });
      expect(publisherSpy.publish).not.toHaveBeenCalled();
    });
    it('should not publish event and changed URL ID for voyaAccesPlan', () => {
      const emptyAccount3 = {
        agreementId:
          '45D6BA3A2020176AB7F6A870EAF39478AF78862DB7F91122FD251AF5E9B9D5F2',
        accountStatus: 'Active',
        accountTitle: 'AA01000020178E1',
        accountType: 'Investment',
        accountBalance: '-1.00',
        sourceSystem: 'PREMIER',
        suppressTab: false,
        voyaSavings: '-1.00',
        includedInOrangeMoney: false,
        accountAllowedForMyVoya: false,
        clientId: 'INGWIN',
        planId: 'PREM001',
        planType: 'INGACCESS',
        accountNumber: 'AA01000020178E1',
        needOMAutomaticUpdate: false,
        planName: 'AA01000020178E1',
        mpStatus: '0',
        firstName: 'CHUNG',
        lastName: 'GOSHA-DP',
        clientAllowed4myVoyaOrSSO: true,
        useMyvoyaHomepage: true,
        advisorNonMoneyTxnAllowed: false,
        advisorMoneyTxnAllowed: false,
        nqPenCalPlan: false,
        enrollmentAllowed: false,
        autoEnrollmentAllowed: false,
        navigateToRSPortfolio: true,
        planLink:
          'https://my3.intg.voya.com/myvoya/link?type=retirement&token=%2F6yO7VeEJyi8l0pYJmC3DWj8MMUwO18%2BMX%2FNyyjt2bPt8xLXXJnUHK%2FVtJ%2FZa%2FFubB6Q95vs6aXaI%2B829hX1sBKlx1lpmmvWaCLE%2FSaR9Zwx29AF%2FpHTfHvw85FlQM4isSgmvIuoYgXhJmrxF%2F%2BAZ4iA2M5pMXU2h6IsWRuhMEc%3D',
        openDetailInNewWindow: false,
        spuid: 'U319596922',
        accountSysKey: 'MjE0NTY3MTYxMg==',
        entitySysKey: '2145671617',
        sourceSite: 'PARTICIPANT',
        nqPlan: false,
        portalSupportFlag: false,
        applicationLink: {
          linkName: 'Go To My Account',
          linkHref:
            '/myvoya/link?type=retirement&token=%2F6yO7VeEJyi8l0pYJmC3DWj8MMUwO18%2BMX%2FNyyjt2bPt8xLXXJnUHK%2FVtJ%2FZa%2FFubB6Q95vs6aXaI%2B829hX1sBKlx1lpmmvWaCLE%2FSaR9Zwx29AF%2FpHTfHvw85FlQM4isSgmvIuoYgXhJmrxF%2F%2BAZ4iA2M5pMXU2h6IsWRuhMEc%3D',
        },
        new: false,
        eligibleForOrangeMoney: false,
        xsellRestricted: false,
        iraplan: false,
        isVoyaAccessPlan: true,
        isRestrictedRetirementPlan: false,
        isVDAApplication: false,
      };
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount3)
      );
      component.fetchAcct({
        paramId:
          'PREM001-45D6BA3A2020176AB7F6A870EAF39478AF78862DB7F91122FD251AF5E9B9D5F2',
        url:
          '/accounts/account-details/PREM001-45D6BA3A2020176AB7F6A870EAF39478AF78862DB7F91122FD251AF5E9B9D5F2/transactions',
      });
      expect(publisherSpy.publish).not.toHaveBeenCalled();
    });
    it('should isRoutingActive be true and call manageGoToAccountButton', () => {
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      });
      expect(component.isRoutingActive).toEqual(true);
      expect(component.selectedTab).toEqual('info');
      expect(component.manageGoToAccountButton).toHaveBeenCalled();
      expect(component.account).toEqual(emptyAccount);
      expect(component.pageData.tabs).toEqual(component.pageData.default_tabs);
    });
    it('should isRoutingActive be false and not call manageGoToAccountButton', () => {
      const emptyAccount1: Account = {
        accountTitle: '',
        accountBalance: '',
        accountBalanceAsOf: '',
        sourceSystem: 'VENDOR',
        suppressTab: false,
        voyaSavings: '',
        includedInOrangeMoney: false,
        accountAllowedForMyVoya: false,
        clientId: '2345',
        planId: '1234',
        planType: '',
        accountNumber: '',
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
        oldPlanLink: '',
      };
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount1)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      });
      expect(component.isRoutingActive).toEqual(false);
      expect(component.manageGoToAccountButton).not.toHaveBeenCalled();
      expect(component.pageData.tabs).toEqual(
        component.pageData.without_transactions_tabs
      );
    });
    it('when targetOfManageAcct will be _self', () => {
      emptyAccount.portalSupportFlag = true;
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      });
      expect(component.targetOfManageAcct).toEqual('_self');
    });
    it('when targetOfManageAcct will be _blank', () => {
      emptyAccount.portalSupportFlag = false;
      accountServiceSpy.getAccountLocalStorage.and.returnValue(
        of(emptyAccount)
      );
      component.fetchAcct({
        paramId: '32323',
        url: '/accounts/account-details/32323/info',
      });
      expect(component.targetOfManageAcct).toEqual('_blank');
    });
  });

  describe('manageGoToAccountButton', () => {
    describe('when it is not HSAAccount', () => {
      beforeEach(() => {
        component.account = emptyAccount;
      });
      it('when showGoToAccountButton will be true', async () => {
        accessServiceSpy.checkWorkplaceAccess.and.returnValue(
          Promise.resolve({myWorkplaceDashboardEnabled: true})
        );
        await component.manageGoToAccountButton();
        expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
        expect(component.showGoToAccountButton).toEqual(true);
      });
      it('when showGoToAccountButton and showGoToMyHistoryButton will not be true', async () => {
        accessServiceSpy.checkWorkplaceAccess.and.returnValue(
          Promise.resolve({myWorkplaceDashboardEnabled: false})
        );
        await component.manageGoToAccountButton();
        expect(component.showGoToAccountButton).toEqual(false);
        expect(component.showGoToMyHistoryButton).toEqual(false);
      });
    });
    it('when it is HSAAccount', async () => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      const emptyAccount1: any = {
        isHSAAccount: true,
        hsaAccountData: {
          HAS_PARTY_ID: 'VOY-14383866',
          Plan_ID: 994787,
          Current_Or_Prior: 'Current',
          Plan_Year_End_Date: '2023-12-31',
          Plan_Type: 'MedicalFlex',
          Plan_Link: 'hsalink',
          Plan_Name: 'FSA',
          Election_Amount: 100.0,
          Calculated_Contribution: 3.85,
          YTD_Contributions: 23.1,
          Employer_Election_Amount: 0.0,
          Employer_YTD_Contributions: 0.0,
          AvailableBalance: 100.0,
          CashBalance: 23.1,
          TotalBalance: 0.0,
          InvestmentBalance: 0.0,
          AsOfDate: '2023-04-04',
        },
      };
      component.account = emptyAccount1;
      await component.manageGoToAccountButton();
      expect(component.account.planLink).toEqual('hsalink');
      expect(component.showGoToAccountButton).toEqual(true);
    });
    it('when it is HSAAccount and GoToMyHistory is True', async () => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      const emptyAccount1: any = {
        isHSAAccount: true,
        hsaAccountData: {
          HAS_PARTY_ID: 'VOY-14383866',
          Plan_ID: 994787,
          Current_Or_Prior: 'Current',
          Plan_Year_End_Date: '2023-12-31',
          Plan_Type: 'MedicalFlex',
          Plan_Link: 'hsalink',
          Plan_Name: 'FSA',
          Election_Amount: 100.0,
          Calculated_Contribution: 3.85,
          YTD_Contributions: 23.1,
          Employer_Election_Amount: 0.0,
          Employer_YTD_Contributions: 0.0,
          AvailableBalance: 100.0,
          CashBalance: 23.1,
          TotalBalance: 0.0,
          InvestmentBalance: 0.0,
          AsOfDate: '2023-04-04',
          OLD_PLANLINK: 'wexaccountlink',
        },
      };
      component.account = emptyAccount1;
      await component.manageGoToAccountButton();
      expect(component.account.oldPlanLink).toEqual('wexaccountlink');
      expect(component.showGoToMyHistoryButton).toEqual(true);
    });
  });

  describe('navigateToGoToAccount', () => {
    it('should open the PWEB URL in same tab', () => {
      component.targetOfManageAcct = '_self';
      const link = 'voya.com';
      component.navigateToGoToAccount('voya.com');
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        link,
        '_self'
      );
    });
  });

  describe('navigateToGoMyHistory', () => {
    it('should open the wex home page in separate window', () => {
      const link = 'wexhomepage.com';
      component.navigateToGoMyHistory('wexhomepage.com');
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(link);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
