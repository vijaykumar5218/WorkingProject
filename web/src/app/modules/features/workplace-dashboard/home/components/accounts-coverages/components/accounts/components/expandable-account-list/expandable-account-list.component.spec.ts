import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {of, Subscription} from 'rxjs';
import {Router, RouterModule} from '@angular/router';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {ExpandableAccountListComponent} from './expandable-account-list.component';
import {AddAccountModalComponent} from '@web/app/modules/features/workplace-dashboard/home/components/hero-card-section/components/landing-add-account/components/add-account-modal/add-account-modal.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as PageText from '../accounts-widgets/constants/account-widget-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {AccountWidgetModal} from '../accounts-widgets/components/account-widget-modal/account-widget-modal.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import { AccessService } from '@shared-lib/services/access/access.service';

describe('ExpandableAccountListComponent', () => {
  const displayText = JSON.parse(JSON.stringify(PageText)).default;
  let component: ExpandableAccountListComponent;
  let fixture: ComponentFixture<ExpandableAccountListComponent>;
  let accountServiceSpy;
  let fetchAggregatedAccountsSpy;
  let modalControllerSpy;
  let subscriptionSpy;
  let utilityServiceSpy;
  let routerSpy;
  let mxServiceSpy;
  let openAddAccountModalSpy;
  let accessServiceSpy;

  const mockAccount: any = {
    hasMXAccount: true,
    categorizedAccounts: [
      {
        accType: 'Investment',
        accountsCount: 3,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountTitle: 'City of Los Angeles DC Plan',
            accountType: 'Investment',
            accountBalance: 71167.48,
            accountBalanceAsOf: '01/12/2023',
            suppressTab: false,
            planLink: 'http://www.voya.com',
            accountNumber: '711016@CITYLA@014633871',
          },
        ],
      },
    ],
  };

  const mockEnrollAccount: any = {
    hasMXAccount: true,
    categorizedAccounts: [
      {
        accType: 'Ready For Enrollment',
        accountsCount: 1,
        accountsTotalBalance: 106770.48,
        accounts: [
          {
            accountTitle: 'City of Los Angeles DC Plan',
            accountType: 'Investment',
            accountBalance: 71167.48,
            accountBalanceAsOf: '01/12/2023',
            suppressTab: false,
            planLink: 'http://www.voya.com',
            accountNumber: '711016@CITYLA@014633871',
          },
        ],
      },
    ],
  };

  const mockReturnedAccount: Account = {
    accountTitle: '401K PLAN',
    accountBalance: '22929.89',
    accountBalanceAsOf: '12/16/2022',
    suppressTab: false,
    voyaSavings: '22929.89',
    includedInOrangeMoney: false,
    accountAllowedForMyVoya: false,
    clientId: 'INGWIN',
    planType: 'DC',
    accountNumber: '555223@INGWIN@858000226',
    needOMAutomaticUpdate: false,
    planName: '401K PLAN',
    mpStatus: '0',
    clientAllowed4myVoyaOrSSO: true,
    useMyvoyaHomepage: true,
    advisorNonMoneyTxnAllowed: true,
    advisorMoneyTxnAllowed: false,
    nqPenCalPlan: false,
    enrollmentAllowed: false,
    autoEnrollmentAllowed: false,
    vruPhoneNumber: '1-800-584-6001',
    rmdRecurringPaymentInd: 'N',
    navigateToRSPortfolio: true,
    planLink: 'http://www.voya.com',
    openDetailInNewWindow: false,
    nqPlan: false,
    eligibleForOrangeMoney: false,
    new: false,
    iraplan: false,
    xsellRestricted: false,
    isVoyaAccessPlan: false,
    isVendorPlan: false,
    isRestrictedRetirementPlan: false,
    isVDAApplication: false,
    planId: '555223',
  };

  const mockMXAccountData: any = {
    account_type_name: 'Checking',
    balance: '0.0',
    guid: 'ACT-d3b883b5-17b6-47b3-b5a1-7c79f7a375a3',
    name: 'Test Pulse Checking Account',
    updated_at: '2022-05-20T13:19:10+00:00',
    user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
    institution_guid: 'INS-322774a5-52d7-480b-9394-b64d0b4f030f',
    small_logo_url:
      'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/default_50x50.png',
    medium_logo_url:
      'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/default_100x100.png',
    institution_name: 'Test Pulse Institution 11',
  };

  const mockVoyaAccessPlanAcct: any = {
    agreementId:
      '32F585951B8AD123EBE8EC76CF2C53D61874DBFA2DF820F7385E2C457E0875AA',
    accountTitle: 'SMITH-DP (VF8000)',
    accountType: 'Investment',
    accountBalance: '46022.00',
    accountBalanceAsOf: '06/21/2019',
    sourceSystem: 'ACES',
    suppressTab: false,
    clientId: 'INGWIN',
    planId: 'VF8000',
    planType: 'INGACCESS',
    planLink: '/myvoyageui/#/accounts/retirement/VF8000/info',
    planName: 'SMITH-DP (VF8000)',
    accountNumber: '9992392918000',
    isVoyaAccessPlan: true,
  };

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', [
        'getMXAccountData',
        'setMxDataLocalStorage',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAggregatedAccounts',
        'openPwebAccountLink',
        'getAccountDataBasedOnType',
        'getAccountDataWithoutType',
        'getIsVoyaAccessPlanAccountData',
        'setAccountLocalStorage',
      ]);
      subscriptionSpy = jasmine.createSpyObj('subscriptionSpy', [
        'unsubscribe',
        'add',
      ]);
      accountServiceSpy.getAggregatedAccounts.and.returnValue({
        subscribe: () => undefined,
      });
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'setSuppressHeaderFooter',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isAltAccessUser: true})
      );

      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
      TestBed.configureTestingModule({
        declarations: [ExpandableAccountListComponent],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Router, useValue: routerSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
      }).compileComponents();
      fixture = TestBed.createComponent(ExpandableAccountListComponent);
      component = fixture.componentInstance;
      fetchAggregatedAccountsSpy = spyOn(component, 'fetchAggregatedAccounts');
      openAddAccountModalSpy = spyOn(component, 'openAddAccountModal');
      component['subscription'] = subscriptionSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchAggregatedAccounts', async () => {
      component.ngOnInit();
      expect(fetchAggregatedAccountsSpy).toHaveBeenCalled();
    });
    it('should call checkMyvoyageAccess and set AltAccessUser to true', async () => {
      component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isAltAccessUser).toBeTrue();
    });
  });

  describe('fetchAggregatedAccounts', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      fetchAggregatedAccountsSpy.and.callThrough();
      observable = of(mockAccount);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockAccount);
        return subscription;
      });
      component.expanded = false;
      component.isEnrollmentAcct = false;
    });
    it('if acctType will be Investment', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(observable);
      component.acctType = 'Investment';
      component.fetchAggregatedAccounts();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.expanded).toEqual(true);
      expect(component.acctTypeIconName).toEqual('investment');
      expect(component.categorizedAccount).toEqual(
        mockAccount['categorizedAccounts'][0]
      );
      expect(component.showManageAccounts).toEqual(true);
      expect(component.showAccount).toEqual(true);
      expect(component.isEnrollmentAcct).toEqual(false);
    });
    it('if acctType will be Ready For Enrollment', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(
        of(mockEnrollAccount)
      );
      component.acctType = 'Ready For Enrollment';
      component.fetchAggregatedAccounts();
      expect(component.acctTypeIconName).toEqual('readyforenrollment');
      expect(component.isEnrollmentAcct).toEqual(true);
    });
    it('if acctType is undefined', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(observable);
      component.acctType = '';
      component.fetchAggregatedAccounts();
      expect(component.expanded).toEqual(false);
      expect(component.acctTypeName).toEqual('');
      expect(component.acctTypeIconName).toEqual('');
      expect(component.showAccount).toEqual(false);
      expect(component.isEnrollmentAcct).toEqual(false);
    });
    it('if categorizedAccounts prop is not exist in res', () => {
      accountServiceSpy.getAggregatedAccounts.and.returnValue(
        of([{hasMXAccount: true}])
      );
      component.acctType = 'Loan';
      component.fetchAggregatedAccounts();
      expect(component.expanded).toEqual(false);
      expect(component.categorizedAccount).toEqual({});
      expect(component.showAccount).toEqual(false);
      expect(component.isEnrollmentAcct).toEqual(false);
    });
  });

  describe('openEnrollNowLink', () => {
    it('should open EnrollNow link in same tab', () => {
      const link =
        'http://a.com?url=http://b.com&PartnerId=http://c.com&target=http://c.com';
      component.openEnrollNowLink(link);
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        link,
        '_self'
      );
    });
  });

  describe('toggleAccounts', () => {
    it('should toggle expanded value true/false and set expandIconImage and expandIconName', () => {
      component.expanded = false;
      component.expandIconImage = 'assets/icon/chevron_down.svg';
      component.expandIconName = 'chevron_down';
      component.toggleAccounts();
      expect(component.expandIconImage).toEqual(
        'assets/icon/journeys/chevron_up.svg'
      );
      expect(component.expandIconName).toEqual('chevron_down');
      expect(component.expandIconImage).toEqual(
        'assets/icon/journeys/chevron_up.svg'
      );
      expect(component.expanded).toEqual(true);
    });

    it('should set icon image and name when image contains up', () => {
      component.expandIconImage = 'assets/icon/chevron_up.svg';
      component.expandIconName = 'chevron_up';
      component.toggleAccounts();
      expect(component.expandIconName).toEqual('chevron_up');
      expect(component.expandIconImage).toEqual('assets/icon/chevron_down.svg');
    });
  });

  describe('openAddAccountModal', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('modalSpy', ['present']);
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      openAddAccountModalSpy.and.callThrough();
    });
    it('should call setSuppressHeaderFooter and create, present modal if NOT MX User', async () => {
      component.enableMX = true;
      component.isMXUser = false;
      await component.openAddAccountModal();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AddAccountModalComponent,
        cssClass: 'modal-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
    it('should redirect to add accounts page is MX User', async () => {
      component.isMXUser = true;
      component.enableMX = true;
      await component.openAddAccountModal();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/accounts/add-accounts'
      );
    });
    it('should not call openAddAccountModal for disabelMX User', async () => {
      component.isMXUser = false;
      component.enableMX = false;
      expect(openAddAccountModalSpy).not.toHaveBeenCalled();
      expect(
        utilityServiceSpy.setSuppressHeaderFooter
      ).not.toHaveBeenCalledWith();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith(
        '/accounts/add-accounts'
      );
    });
  });

  describe('goToPlanLink', () => {
    beforeEach(() => {
      spyOn(window, 'open');
    });
    it('should call open PlanLink in new tab if it contains http', () => {
      mockReturnedAccount.planLink = 'http://www.voya.com';
      component.goToPlanLink(mockReturnedAccount);
      expect(window.open).toHaveBeenCalledWith(
        mockReturnedAccount.planLink,
        '_blank'
      );
    });
    it('should call navigateToMXAcct if accType is MX', () => {
      spyOn(component, 'navigateToMXAcct');
      mockReturnedAccount.planLink =
        '/myvoyageui/#/accounts/mxdetails-account/ACT-d3b883b5-17b6-47b3-b5a1-7c79f7a375a3';
      component.goToPlanLink(mockReturnedAccount);
      expect(component.navigateToMXAcct).toHaveBeenCalledWith(
        'ACT-d3b883b5-17b6-47b3-b5a1-7c79f7a375a3'
      );
    });
    it('should call navigateToAcct if sourceSystem is EASE', () => {
      spyOn(component, 'navigateToAcct');
      component.goToPlanLink({
        ...mockReturnedAccount,
        ...{
          planId: '555223',
          planLink: '/myvoyageui/#/accounts/account-details/555223/info',
          sourceSystem: 'EASE',
        },
      });
      expect(component.navigateToAcct).toHaveBeenCalledWith(
        mockReturnedAccount.planId
      );
    });
    it('should call navigateToAcct if sourceSystem is VENDOR', () => {
      spyOn(component, 'navigateToAcct');
      component.goToPlanLink({
        ...mockReturnedAccount,
        ...{
          planId: '555223',
          planLink: '/myvoyageui/#/accounts/account-details/555223/info',
          sourceSystem: 'VENDOR',
        },
      });
      expect(component.navigateToAcct).toHaveBeenCalledWith(
        mockReturnedAccount.planId,
        'vendorAccounts'
      );
    });
    it('should call navigateToAcct if sourceSystem is STOCK', () => {
      spyOn(component, 'navigateToAcct');
      component.goToPlanLink({
        ...mockReturnedAccount,
        ...{
          planId: '555223',
          planLink: '/myvoyageui/#/accounts/account-details/555223/info',
          sourceSystem: 'STOCK',
        },
      });
      expect(component.navigateToAcct).toHaveBeenCalledWith(
        mockReturnedAccount.planId,
        'stockAccounts'
      );
    });
    it('should call navigateToIsVoyaAccessPlan if isVoyaAccessPlan is true', () => {
      spyOn(component, 'navigateToIsVoyaAccessPlan');
      component.goToPlanLink(mockVoyaAccessPlanAcct);
      expect(component.navigateToIsVoyaAccessPlan).toHaveBeenCalledWith(
        mockVoyaAccessPlanAcct.planId,
        mockVoyaAccessPlanAcct.agreementId
      );
    });
  });

  describe('navigateToIsVoyaAccessPlan', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockVoyaAccessPlanAcct);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockVoyaAccessPlanAcct);
        return subscription;
      });
    });
    it('should set the account data and navigate to acct details page', () => {
      accountServiceSpy.getIsVoyaAccessPlanAccountData.and.returnValue(
        observable
      );
      component.navigateToIsVoyaAccessPlan(
        mockVoyaAccessPlanAcct.planId,
        mockVoyaAccessPlanAcct.agreementId
      );
      expect(
        accountServiceSpy.getIsVoyaAccessPlanAccountData
      ).toHaveBeenCalledWith(
        mockVoyaAccessPlanAcct.planId,
        mockVoyaAccessPlanAcct.agreementId
      );
      expect(accountServiceSpy.setAccountLocalStorage).toHaveBeenCalledWith(
        mockVoyaAccessPlanAcct
      );
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/account-details/${mockVoyaAccessPlanAcct.planId +
          '-isVoyaAccessPlan-' +
          mockVoyaAccessPlanAcct.agreementId}/info`
      );
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('navigateToAcct', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockReturnedAccount);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockReturnedAccount);
        return subscription;
      });
    });
    it('when type is defined', () => {
      accountServiceSpy.getAccountDataBasedOnType.and.returnValue(observable);
      component.navigateToAcct('555223', 'retirementAccounts');
      expect(accountServiceSpy.getAccountDataBasedOnType).toHaveBeenCalledWith(
        '555223',
        'retirementAccounts'
      );
      expect(accountServiceSpy.setAccountLocalStorage).toHaveBeenCalledWith(
        mockReturnedAccount
      );
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/account-details/555223/info`
      );
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
    it('when type is not defined', () => {
      accountServiceSpy.getAccountDataWithoutType.and.returnValue(observable);
      component.navigateToAcct('555223');
      expect(accountServiceSpy.getAccountDataWithoutType).toHaveBeenCalledWith(
        '555223'
      );
    });
  });

  describe('navigateToMXAcct', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      observable = of(mockMXAccountData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockMXAccountData);
        return subscription;
      });
      mxServiceSpy.getMXAccountData.and.returnValue(observable);
    });
    it('should set the account to be based on Guid and navigate to next page', () => {
      component.navigateToMXAcct(mockMXAccountData['guid']);
      expect(mxServiceSpy.getMXAccountData).toHaveBeenCalledWith(
        mockMXAccountData['guid']
      );
      expect(mxServiceSpy.setMxDataLocalStorage).toHaveBeenCalledWith(
        mockMXAccountData
      );
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/mxdetails-account/${mockMXAccountData['guid']}`
      );
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('openManageAccountWidgetModal', () => {
    it('should get overlay screen and display mx widget', () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      component.openManageAccountWidgetModal();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AccountWidgetModal,
        cssClass: 'modal-fullscreen',
        componentProps: {
          modalHeader: displayText.manageAccounts,
          buttonText: displayText.cancelLink,
          widgetType: WidgetType.MANAGE_ACCOUNT,
        },
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
