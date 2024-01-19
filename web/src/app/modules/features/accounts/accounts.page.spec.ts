import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {AccountsPage} from './accounts.page';
import {Component, ElementRef} from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({selector: 'app-footer-desktop', template: ''})
class MockFooterComponent {}

describe('AccountPage', () => {
  let component: AccountsPage;
  let fixture: ComponentFixture<AccountsPage>;
  let headerTypeServiceSpy;
  let accountServiceSpy;
  let MXServiceSpy;
  let routerSpy;
  let footerTypeServiceSpy;
  let nativeElementSpy;
  let sharedUtilityServiceSpy;
  let accessServiceSpy;

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
  };

  const emptyAccountsData = {
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

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['scrollToTop', 'isDesktop']
      );
      sharedUtilityServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/accounts/summary',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
        url: '/accounts/all-account/summary',
      };
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      MXServiceSpy = jasmine.createSpyObj('MXServiceSpy', [
        'getMxAccountConnect',
        'hasUser',
        'getHeaderData',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'allAccountsWithoutHSA',
        'allAccountsWithHSA',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('footerTypeServiceSpy', [
        'publish',
      ]);
      nativeElementSpy = jasmine.createSpyObj('nativeElement', [
        'scrollIntoView',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true, enableMX: true, isAltAccessUser: true})
      );
      TestBed.configureTestingModule({
        declarations: [AccountsPage, MockFooterComponent],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: MXService, useValue: MXServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountsPage);
      component = fixture.componentInstance;
      component.topmostElement = {
        nativeElement: nativeElementSpy,
      } as ElementRef;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
      component.isDesktop = false;
      spyOn(component, 'allAccountSelected');
      spyOn(component, 'hideAccountList');
      spyOn(component, 'hasMXWidget');
      spyOn(component, 'fetchMXHeaderContent');
    });
    describe('when isViewInit would be true', () => {
      beforeEach(() => {
        component.isViewInit = true;
      });
      it('when isDesktop would be true', () => {
        sharedUtilityServiceSpy.isDesktop.and.returnValue(of(true));
        component.ngOnInit();
        expect(sharedUtilityServiceSpy.isDesktop).toHaveBeenCalled();
        expect(component.isDesktop).toEqual(true);
        expect(component.allAccountSelected).toHaveBeenCalled();
      });
      it('should call checkMyvoyageAccess and set response properties', () => {
        component.ngOnInit();
        expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
        expect(component.myWorkplaceDashboardEnabled).toEqual(true);
        expect(component.enableMX).toEqual(true);
      });
      it('when isDesktop would be false', () => {
        sharedUtilityServiceSpy.isDesktop.and.returnValue(of(false));
        component.ngOnInit();
        expect(component.isDesktop).toEqual(false);
        expect(component.hideAccountList).toHaveBeenCalled();
        expect(component.hasMXWidget).toHaveBeenCalled();
        expect(component.fetchMXHeaderContent).toHaveBeenCalled();
      });
      it('should call checkMyvoyageAccess and set altAccessUser to true', () => {
        component.ngOnInit();
        expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
        expect(component.isAltAccessUser).toBeTrue();
      });
    });
    describe('isViewInit would be undefined', () => {
      beforeEach(() => {
        component.isViewInit = undefined;
        sharedUtilityServiceSpy.isDesktop.and.returnValue(of(true));
      });
      it('should not call allAccountSelected,hideAccountList,hasMXWidget,fetchMXHeaderContent', () => {
        component.ngOnInit();
        expect(sharedUtilityServiceSpy.isDesktop).toHaveBeenCalled();
        expect(component.allAccountSelected).not.toHaveBeenCalled();
        expect(component.hideAccountList).not.toHaveBeenCalled();
        expect(component.hasMXWidget).not.toHaveBeenCalled();
        expect(component.fetchMXHeaderContent).not.toHaveBeenCalled();
      });
    });
    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
  });

  describe('clickAllAccounts', () => {
    beforeEach(() => {
      spyOn(component, 'focusOnElement');
    });
    it('when event is passed as the parameter of fun', () => {
      component.clickAllAccounts();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'accounts/all-account/summary'
      );
      expect(component.focusOnElement).toHaveBeenCalled();
    });
  });

  describe('focusOnElement', () => {
    let eleSpy;
    beforeEach(() => {
      eleSpy = jasmine.createSpyObj('eleSpy', ['focus']);
      component.focusedElement = jasmine.createSpyObj('NativeEl', [''], {
        nativeElement: eleSpy,
      });
    });
    it('should foucus on ele', () => {
      component.focusOnElement();
      expect(eleSpy.focus).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    let mxObservable;
    let mxSubscription;
    const mxAccounts = {
      accounts: [
        {
          account_number: 'XXXXX9200',
          account_type_name: 'Credit Card',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
          name: 'Gringotts Credit card',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 1',
        },
        {
          account_number: '2456635796',
          account_type_name: 'Savings',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-dc08fde9-3a91-41c6-9fdc-6006413e0917',
          name: 'MX Bank Savings',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 2',
        },
        {
          account_number: 'XXXXXX2959',
          account_type_name: 'Credit Card',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-fe0d71cd-cab0-4ad4-8000-b5e37a887093',
          name: 'Gringotts Credit card',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 3',
        },
        {
          account_number: '4684406678',
          account_type_name: 'Checking',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
          name: 'MX Bank Checking',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 4',
        },
        {
          account_number: '7814762113',
          account_type_name: 'Mortgage',
          available_balance: '400000.0',
          balance: '350000.0',
          currency_code: 'USD',
          guid: 'ACT-cdcae8fa-0125-42df-b93c-7fc64e60ee50',
          name: 'Home Mortgage',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 5',
        },
        {
          account_number: '1932602460',
          account_type_name: 'Investment',
          available_balance: '1000.0',
          balance: '1000.0',
          currency_code: 'USD',
          guid: 'ACT-4365d345-7d89-46a2-980e-f5367c0a6679',
          name: 'MX Investment',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 6',
        },
        {
          account_number: '4253099451',
          account_type_name: 'Loan',
          available_balance: '25000.0',
          balance: '22300.0',
          currency_code: 'USD',
          guid: 'ACT-a42d8c48-f494-41a7-9d19-dd4b89f19cef',
          name: 'Personal Loan',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 7',
        },
        {
          account_number: '7911935148',
          account_type_name: 'Investment',
          available_balance: '34600.0',
          balance: '34600.0',
          currency_code: 'USD',
          guid: 'ACT-5944367a-8f06-46b4-8433-8e397e4a65ee',
          name: 'Roth IRA',
          routing_number: '731775673',
          updated_at: '2022-05-31T12:54:19+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
          institution_name: 'MX Bank (Oauth) 8',
        },
        {
          account_type_name: 'Savings',
          balance: '36000.0',
          guid: 'ACT-ffb3d975-848b-444f-a82f-1d40f5bdc8ce',
          name: 'Fake Savings Bank',
          updated_at: '2022-05-20T13:19:13+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730_100x100.png',
          institution_name: 'Manual Institution 9',
        },
        {
          account_type_name: 'Loan',
          balance: '2000.0',
          guid: 'ACT-adebc7bf-1165-4632-8a09-7437f759a5e0',
          name: 'Bike Loan',
          updated_at: '2022-05-20T13:19:13+00:00',
          user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
          institution_guid: 'INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730',
          small_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730_50x50.png',
          medium_logo_url:
            'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-MANUAL-cb5c-1d48-741c-b30f4ddd1730_100x100.png',
          institution_name: 'Manual Institution 10',
        },
        {
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
        },
      ],
    };
    let allAccountObservable;
    let allAccountSubscription;
    beforeEach(() => {
      allAccountObservable = of(emptyAccountsData);
      allAccountSubscription = new Subscription();
      spyOn(allAccountObservable, 'subscribe').and.callFake(f => {
        f(emptyAccountsData);
        return allAccountSubscription;
      });
      accountServiceSpy.allAccountsWithoutHSA.and.returnValue(
        allAccountObservable
      );
      mxObservable = of(true);
      mxSubscription = new Subscription();
      spyOn(mxObservable, 'subscribe').and.callFake(f => {
        f(mxAccounts);
        return mxSubscription;
      });
      MXServiceSpy.getMxAccountConnect.and.returnValue(mxObservable);
      spyOn(component.subscription, 'add');
      spyOn(component, 'hasMXWidget');
      spyOn(component, 'fetchMXHeaderContent');
      spyOn(component, 'spendingAndBudgetWidget');
      spyOn(component, 'fetchHSAAcct');
    });
    it('Should call allAccountsWithoutHSA and getMxAccountConnect and when isDesktop would be true', async () => {
      component.nonHSAaccounts = null;
      component.showManageAccounts = false;
      component.isDesktop = true;
      await component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'ACCOUNTS'
      );
      expect(accountServiceSpy.allAccountsWithoutHSA).toHaveBeenCalled();
      expect(component.nonHSAaccounts).toEqual(emptyAccountsData);
      expect(component.showManageAccounts).toEqual(true);
      expect(MXServiceSpy.getMxAccountConnect).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(mxSubscription);
      expect(component.subscription.add).toHaveBeenCalledWith(
        allAccountSubscription
      );
      expect(component.fetchHSAAcct).toHaveBeenCalled();
      expect(component.hasMXWidget).not.toHaveBeenCalled();
      expect(component.fetchMXHeaderContent).not.toHaveBeenCalled();
      expect(component.spendingAndBudgetWidget).not.toHaveBeenCalled();
    });

    it('When isDesktop would be false', async () => {
      component.isDesktop = false;
      await component.ionViewWillEnter();
      expect(component.hasMXWidget).toHaveBeenCalled();
      expect(component.fetchMXHeaderContent).toHaveBeenCalled();
      expect(component.spendingAndBudgetWidget).toHaveBeenCalled();
    });
  });

  describe('fetchHSAAcct', () => {
    const emptyHSAAccountsData: any = {
      hsaAccounts: {},
    };
    let hsaAccountObservable;
    let hsaAccountSubscription;
    beforeEach(() => {
      hsaAccountObservable = of(emptyHSAAccountsData);
      hsaAccountSubscription = new Subscription();
      spyOn(hsaAccountObservable, 'subscribe').and.callFake(f => {
        f(emptyHSAAccountsData);
        return hsaAccountSubscription;
      });
      component.hsaAccounts = {};
      spyOn(component.subscription, 'add');
      accountServiceSpy.allAccountsWithHSA.and.returnValue(
        hsaAccountObservable
      );
    });
    it('should set the hsaAccounts data in accounts data', () => {
      component.fetchHSAAcct();
      expect(component.subscription.add).toHaveBeenCalledWith(
        hsaAccountSubscription
      );
      expect(accountServiceSpy.allAccountsWithHSA).toHaveBeenCalled();
      expect(component.hsaAccounts).toEqual({hsaAccounts: {}});
    });
  });

  describe('routerNavigation', () => {
    let subscriptionMock;
    const mockData = {
      id: 1,
      url: '/accounts/account-details/123',
    };
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      subscriptionMock = new Subscription();
      spyOn(component, 'allAccountSelected');
      spyOn(component, 'hideAccountList');
      const observable = of(mockData);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      routerSpy.events.pipe.and.returnValue(observable);
    });
    it('When isDesktop would be true', () => {
      component.isDesktop = true;
      component.routerNavigation();
      expect(component.allAccountSelected).toHaveBeenCalledWith([
        '',
        'accounts',
        'account-details',
        '123',
      ]);
      expect(component.hideAccountList).not.toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
      expect(sharedUtilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    });
    it('When isDesktop would be false', () => {
      component.isDesktop = false;
      component.routerNavigation();
      expect(component.hideAccountList).toHaveBeenCalledWith([
        '',
        'accounts',
        'account-details',
        '123',
      ]);
      expect(component.allAccountSelected).not.toHaveBeenCalled();
    });
  });

  describe('allAccountSelected', () => {
    beforeEach(() => {
      component.isAllAccountsSelected = false;
      spyOn(component, 'focusOnElement');
    });
    it('When isAllAccountsSelected would be true', () => {
      component.allAccountSelected(['', 'accounts', 'all-account']);
      expect(component.isAllAccountsSelected).toEqual(true);
      expect(component.focusOnElement).not.toHaveBeenCalled();
    });
    it('When isAllAccountsSelected would be false', () => {
      component.allAccountSelected(['', 'accounts', 'manage-accounts']);
      expect(component.isAllAccountsSelected).toEqual(false);
      expect(component.focusOnElement).toHaveBeenCalled();
    });
  });

  describe('hideAccountList', () => {
    beforeEach(() => {
      component.selectedTab = undefined;
    });
    describe('When selectedTab would not be undefined', () => {
      it('When selectedTab would be summary', () => {
        component.hideAccountList(['', 'accounts', 'all-account']);
        expect(component.selectedTab).toEqual('summary');
      });
      it('When selectedTab would not be summary', () => {
        component.hideAccountList(['', 'accounts', 'all-account', 'insights']);
        expect(component.selectedTab).toEqual('insights');
      });
    });
    it('When selectedTab would be undefined', () => {
      component.hideAccountList(['', 'accounts', 'manage-accounts']);
      expect(component.selectedTab).toEqual(undefined);
    });
  });

  describe('fetchMXHeaderContent', () => {
    let mockData;
    let observable;
    let subscription;
    beforeEach(() => {
      mockData = [
        {
          spending_budget_description: [
            {
              bottom_text:
                'Let’s look at your current spending and this months budget.',
              image_url:
                'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
              top_text: '',
            },
          ],
          spending_budget_title: '',
        },
      ];
      observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      MXServiceSpy.getHeaderData.and.returnValue(observable);
      spyOn(component.subscription, 'add');
      component.getHeaderMessage = undefined;
    });

    it('should call getScreenMessage from MXService and return message', () => {
      component.fetchMXHeaderContent();
      expect(MXServiceSpy.getHeaderData).toHaveBeenCalled();
      expect(component.getHeaderMessage).toEqual(mockData);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('hasMXWidget', () => {
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      component.hasMXUser = false;
    });
    it('When hasUser would be true', () => {
      const observable = of(true);
      const subscriptionMock = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscriptionMock;
      });
      MXServiceSpy.hasUser.and.returnValue(observable);
      component.hasMXWidget();
      expect(MXServiceSpy.hasUser).toHaveBeenCalled();
      expect(component.hasMXUser).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
    });
    it('When hasUser would be false', () => {
      MXServiceSpy.hasUser.and.returnValue(of(false));
      component.hasMXWidget();
      expect(component.hasMXUser).toEqual(false);
    });
  });

  describe('spendingAndBudgetWidget', () => {
    let spendSpy;
    let budgetSpy;
    beforeEach(() => {
      spendSpy = jasmine.createSpyObj('SpendWidget', ['refreshWidget']);
      budgetSpy = jasmine.createSpyObj('BudgetWidget', ['refreshWidget']);
      component.spendingWidget = {
        widget: spendSpy,
      } as SpendingWidgetComponent;
      component.budgethWidget = {
        widget: budgetSpy,
      } as BudgetWidgetComponent;
    });
    it('should refresh all widgets', () => {
      component.spendingAndBudgetWidget();
      expect(spendSpy.refreshWidget).toHaveBeenCalled();
      expect(budgetSpy.refreshWidget).toHaveBeenCalled();
    });
  });

  it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
      type: FooterType.tabsnav,
      selectedTab: 'accounts',
    });
  });

  describe('handle  Add AccountClick', () => {
    it('should navigate to url add accounts', () => {
      component.handleAddAccountClick();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/add-accounts`
      );
    });
  });

  describe('handle  Manage AccountClick', () => {
    it('should navigate to url manage accounts', () => {
      component.handleManageAccountClick();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `accounts/manage-accounts`
      );
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
