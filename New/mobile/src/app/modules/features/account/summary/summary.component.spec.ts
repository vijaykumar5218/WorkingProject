import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SummaryComponent} from './summary.component';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {ACCOUNT_LIFECYCLE_EVENTS} from '../account.page';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let headerTypeServiceSpy;
  let footerTypeServiceSpy;
  let accountServiceSpy;
  let router;
  let mxServiceSpy;
  let subscriptionSpy;
  let mxUserSubscriptionSpy;
  let eventManagerServiceSpy;
  let eventsSubscriptionSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
        'publishSelectedTab',
      ]);

      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getJSON',
        'setAccount',
        'setParticipant',
        'getPrepObject',
        'publishSelectedTab',
      ]);

      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxAccountConnect',
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getMxAccountConnect.and.returnValue(
        of({
          accounts: [{} as MXAccount],
        })
      );
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));

      subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      mxUserSubscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      eventsSubscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createSubscriber',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true})
      );

      TestBed.configureTestingModule({
        declarations: [SummaryComponent],
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          RouterTestingModule,
          IonicModule.forRoot(),
        ],
        providers: [
          {provide: Router, useValue: router},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component['subscription'] = subscriptionSpy;
      component['mxUserSubscription'] = mxUserSubscriptionSpy;
      component['eventsSubscription'] = eventsSubscriptionSpy;
    })
  );

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

  const testPrepObject = {
    clientAction: '',
    pageData: {
      gaData: {
        userId: '43434',
        sessionId: '',
        ssoPurpose: '',
        rsDomain: '',
      },
      pageId: '',
      services: {
        submit: {
          method: '',
          url: '',
        },
      },
      fields: '',
      sessionInfo: {
        domain: '',
        clientId: '',
        appId: '',
        theme: '',
        qdro: false,
        eoi: false,
        guidanceEnabled: false,
      },
    },
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call accessService checkMyvoyageAccess and set isHealthOnly', () => {
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isHealthOnly).toBeTrue();
    });

    it('should call mxService getMxAccountConnect and set showManageAccounts to true if result > 0', () => {
      component.showManageAccounts = false;
      component.ngOnInit();

      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalled();
      expect(component.showManageAccounts).toBeTrue();
    });

    it('should call mxService getMxAccountConnect and set showManageAccounts to false if result = 0', () => {
      mxServiceSpy.getMxAccountConnect.and.returnValue(
        of({
          accounts: [],
        })
      );
      component.showManageAccounts = true;
      component.ngOnInit();

      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalled();
      expect(component.showManageAccounts).toBeFalse();
    });

    it('should call mxService getIsMxUserByMyvoyageAccess and set hasMXUser to returned value', () => {
      component.hasMXUser = true;

      component.ngOnInit();

      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.hasMXUser).toBeFalse();
    });
  });

  describe('ionViewWillEnter', () => {
    let netSpy;
    let spendSpy;
    let budgetSpy;
    beforeEach(() => {
      component.firstLoad = false;
      spyOn(component, 'getAccountSummary');

      netSpy = jasmine.createSpyObj('NetWidget', ['refreshWidget']);
      spendSpy = jasmine.createSpyObj('SpendWidget', ['refreshWidget']);
      budgetSpy = jasmine.createSpyObj('BudgetWidget', ['refreshWidget']);

      component.netWorthWidget = {
        widget: netSpy,
      } as NetWorthComponent;
      component.spendingWidget = {
        widget: spendSpy,
      } as SpendingWidgetComponent;
      component.budgethWidget = {
        widget: budgetSpy,
      } as BudgetWidgetComponent;
    });

    it('should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Accounts',
        btnright: true,
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'account',
      });
      expect(component.getAccountSummary).toHaveBeenCalled();
    });

    it('should publish summary as selectedTab', () => {
      component.ionViewWillEnter();
      expect(accountServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'summary'
      );
    });

    it('should refresh all widgets if firstload = false', () => {
      component.firstLoad = false;
      component.ionViewWillEnter();

      expect(netSpy.refreshWidget).toHaveBeenCalled();
      expect(spendSpy.refreshWidget).toHaveBeenCalled();
      expect(budgetSpy.refreshWidget).toHaveBeenCalled();
    });

    it('should not refresh all widgets if firstload = true', () => {
      component.firstLoad = true;
      component.ionViewWillEnter();

      expect(netSpy.refreshWidget).not.toHaveBeenCalled();
      expect(spendSpy.refreshWidget).not.toHaveBeenCalled();
      expect(budgetSpy.refreshWidget).not.toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should subscribe to viewWillEnter events from parent if firstLoad is true', () => {
      const obsSpy = jasmine.createSpyObj('Obs', ['subscribe']);
      eventManagerServiceSpy.createSubscriber.and.returnValue(obsSpy);

      component.firstLoad = true;

      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
        ACCOUNT_LIFECYCLE_EVENTS
      );
      expect(obsSpy.subscribe).toHaveBeenCalled();
      expect(component.firstLoad).toBeFalse();
    });

    it('should not subscribe to viewWillEnter events from parent if firstLoad is false', () => {
      component.firstLoad = false;

      component.ionViewDidEnter();
      expect(eventManagerServiceSpy.createSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('sendtitle', () => {
    let emptyAccount;
    beforeEach(() => {
      emptyAccount = {
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
      };
    });
    it('should send title when the account is not HSA', () => {
      const account = emptyAccount;
      account.isVoyaAccessPlan = false;

      component.sendtitle(account);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/account/retirement-account'
      );
      expect(accountServiceSpy.setAccount).toHaveBeenCalledWith(account);
    });

    it('should not send title when account is HSA (isVendorPlan)', () => {
      const account = emptyAccount;
      account.isVoyaAccessPlan = true;

      component.sendtitle(account);
      expect(router.navigateByUrl).not.toHaveBeenCalledWith();
      expect(accountServiceSpy.setAccount).not.toHaveBeenCalled();
    });

    it('should not send title when account is HSA (isVoyaAccessPlan)', () => {
      const account = emptyAccount;
      account.isVoyaAccessPlan = true;

      component.sendtitle(account);
      expect(router.navigateByUrl).not.toHaveBeenCalledWith();
      expect(accountServiceSpy.setAccount).not.toHaveBeenCalled();
    });

    it('should not send title when account is NQPenCalPlan', () => {
      const account = emptyAccount;
      account.sourceSystem = 'NQPenCalPlan';
      component.sendtitle(account);
      expect(router.navigateByUrl).not.toHaveBeenCalledWith();
      expect(accountServiceSpy.setAccount).not.toHaveBeenCalled();
    });
  });

  describe('routeToMXAccount', () => {
    it('should route to mx account', () => {
      component.routeToMXAccount();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/account/mxdetails-account'
      );
    });
  });

  describe('get Summarydata', () => {
    it('Should call data', async () => {
      component.accounts = undefined;
      accountServiceSpy.getPrepObject.and.returnValue(testPrepObject);
      accountServiceSpy.getJSON.and.returnValue(
        Promise.resolve(emptyAccountsData)
      );
      await component.getAccountSummary();
      expect(component.accounts).toEqual(emptyAccountsData);
      expect(accountServiceSpy.getJSON).toHaveBeenCalled();
    });
  });

  describe('handle  Add AccountClick', () => {
    it('should navigate to url add accounts', () => {
      component.handleAddAccountClick();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/account/add-accounts'
      );
    });
  });

  describe('handle  Manage AccountClick', () => {
    it('should navigate to url manage accounts', () => {
      component.handleManageAccountClick();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/account/manage-accounts'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
      expect(mxUserSubscriptionSpy.unsubscribe).toHaveBeenCalled();
      expect(eventsSubscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
