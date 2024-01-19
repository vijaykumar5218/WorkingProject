import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {MyvoyageHeaderComponent} from './myvoyage-header.component';
import {of, Subscription} from 'rxjs';
import {Component, Input} from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {NavigationEnd, Router} from '@angular/router';
import {AccountService} from '@shared-lib/services/account/account.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import content from './constants/content.json';
import {MyVoyageHeaderService} from './services/myvoyage-header.service';
@Component({selector: 'ion-header', template: ''})
class MockIonHeader {}

@Component({selector: 'v-brand-stripe', template: ''})
class MockBrandStripe {
  @Input() imageSource;
  @Input() colorFrom;
  @Input() colorTo;
}

@Component({selector: 'v-primary-navigation', template: ''})
class MockPrimaryNav {
  @Input() logoSrc;
  @Input() disableSearch;
  @Input() noprofileicon;
}

@Component({selector: 'v-desktop-navbar-item', template: ''})
class MockDesktopNavbarItem {
  @Input() text;
  @Input() link;
  @Input() selected;
}

@Component({selector: 'v-dropdown-item', template: ''})
class MockDropdownItem {
  @Input() text;
  @Input() link;
  @Input() slot;
  @Input() desktop;
}

describe('MyvoyageHeaderComponent', () => {
  let component: MyvoyageHeaderComponent;
  let fixture: ComponentFixture<MyvoyageHeaderComponent>;
  let headerTypeServiceSpy;
  let journeyServiceSpy;
  let routerSpy;
  let accountServiceSpy;
  let mxServiceSpy;
  let benefitsServiceSpy;
  let myVoyageHeaderServiceSpy;
  let checkForNewMsgsSpy;

  beforeEach(
    waitForAsync(() => {
      myVoyageHeaderServiceSpy = jasmine.createSpyObj('MyVoyageHeaderService', [
        'getCategoryData',
        'initializeNotificationCount',
        'getNotificationCount',
        'clearCountInterval',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('benefitsServiceSpy', [
        'getBenefitEnrolledData',
      ]);

      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAccountDataWithoutType',
        'getIsVoyaAccessPlanAccountData',
      ]);
      mxServiceSpy = jasmine.createSpyObj('mxServiceSpy', ['getMXAccountData']);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'getSelectedTab$',
        'backToPrevious',
        'qualtricsInitialize',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('journeyServiceSpy', [
        'getCurrentJourney',
        'publishLeaveJourney',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 1,
        landingAndOverviewContent:
          '{"intro":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg"},"overview":{"header":"Preparing for retirement","message":"It\'s a good time to think about the next phase of your life. Find out how to get organized and take actionable steps to prepare for retirement.","imgUrl":"assets/icon/journeys/In_Company.svg","summarySteps":[]}}',
        resourcesContent: '',
        steps: [],
      });
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/journeys',
            })
          ),
        },
        navigate: jasmine.createSpy(),
        navigateByUrl: jasmine.createSpy(),
      };
      TestBed.configureTestingModule({
        declarations: [
          MyvoyageHeaderComponent,
          MockBrandStripe,
          MockIonHeader,
          MockPrimaryNav,
          MockDesktopNavbarItem,
          MockDropdownItem,
        ],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: MyVoyageHeaderService, useValue: myVoyageHeaderServiceSpy},
        ],
        imports: [],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyvoyageHeaderComponent);
    headerTypeServiceSpy.getSelectedTab$.and.returnValue(of('Home'));
    component = fixture.componentInstance;
    checkForNewMsgsSpy = spyOn(component, 'checkForNewMsgs');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
    });
    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('should call qualtricsInitialize', () => {
      component.ngOnInit();
      expect(headerTypeServiceSpy.qualtricsInitialize).toHaveBeenCalled();
    });
    it('should call checkForNewMsgs', () => {
      component.ngOnInit();
      expect(component.checkForNewMsgs).toHaveBeenCalled();
    });
  });

  describe('routerNavigation', () => {
    let mockData;
    let subscription;

    beforeEach(() => {
      spyOn(component.subscription, 'add');
      spyOn(component, 'smallDeviceNavContent');
      spyOn(component, 'fetchCurrentRootPath');
      mockData = new NavigationEnd(123, '/journeys', '/journeys');
      const observable = of(mockData);
      subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscription;
      });
      routerSpy.events.pipe.and.returnValue(observable);
    });

    it('should call smallDeviceNavContent, and fetchCurrentRootPath if event is a navigationend event', () => {
      component.routerNavigation();
      expect(component.smallDeviceNavContent).toHaveBeenCalledWith(
        mockData.url
      );
      expect(component.fetchCurrentRootPath).toHaveBeenCalledWith(mockData.url);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('smallDeviceNavContent', () => {
    it('for account page', () => {
      spyOn(component, 'accountNavContent');
      component.smallDeviceNavContent('/accounts');
      expect(component.accountNavContent).toHaveBeenCalledWith([
        '',
        'accounts',
      ]);
    });
    it('for coverages page', () => {
      spyOn(component, 'coveragesNavContent');
      component.smallDeviceNavContent('/coverages');
      expect(component.coveragesNavContent).toHaveBeenCalledWith([
        '',
        'coverages',
      ]);
    });
    describe('for journey page', () => {
      it('When route would be /journeys-list', () => {
        component.content = content;
        component.smallDeviceNavContent('/journeys-list');
        expect(component.smallDeviceContent).toEqual({
          title: 'Life Events',
        });
      });
      it('When route would be /journeys/journey/1/steps?journeyType=recommended', () => {
        component.smallDeviceNavContent(
          '/journeys/journey/1/steps?journeyType=recommended'
        );
        expect(component.smallDeviceContent).toEqual({
          title: 'Preparing for retirement',
          isBackBtn: true,
          previousPage: '/journeys-list',
        });
        expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      });
      it('when getCurrentJourney would be undefined', () => {
        journeyServiceSpy.getCurrentJourney.and.returnValue(undefined);
        component.smallDeviceNavContent(
          '/journeys/journey/1/steps?journeyType=recommended'
        );
        expect(component.smallDeviceContent).not.toEqual({
          title: 'Preparing for retirement',
          isBackBtn: true,
          previousPage: '/journeys-list',
        });
      });
    });
    it('for home page', () => {
      component.smallDeviceNavContent('/home');
      expect(component.smallDeviceContent).toEqual({});
    });
    it('for more page', () => {
      spyOn(component, 'moreNavContent');
      component.smallDeviceNavContent('/more');
      expect(component.moreNavContent).toHaveBeenCalledWith(['', 'more']);
    });
    it('for notification page', () => {
      component.smallDeviceContent = {};
      component.smallDeviceNavContent('/notification');
      expect(component.smallDeviceContent).toEqual({
        title: 'notifications',
        isBackBtn: true,
        previousPage: '',
      });
    });
    it('for net-worth page', () => {
      component.smallDeviceContent = {};
      component.smallDeviceNavContent('/net-worth');
      expect(component.smallDeviceContent).toEqual({
        title: 'Net Worth',
        isBackBtn: true,
        previousPage: '/home',
      });
    });
    it('for Financial Summary page', () => {
      component.smallDeviceContent = {};
      component.smallDeviceNavContent('/financial-wellness');
      expect(component.smallDeviceContent).toEqual({
        title: 'Financial Summary',
        isBackBtn: true,
        previousPage: '/home',
      });
    });
  });

  describe('accountNavContent', () => {
    let retirementObservable;
    let retirementSubscription;
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
    const emptyMXAccount = {
      account_number: '',
      account_type_name: '',
      available_balance: '',
      balance: '',
      currency_code: '',
      guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      institution_guid: '',
      medium_logo_url: '',
      name: '',
      routing_number: '',
      small_logo_url: '',
      updated_at: '',
      user_guid: '',
    };
    let mxObservable;
    beforeEach(() => {
      component.smallDeviceContent = {};
      retirementObservable = of(emptyAccount);
      retirementSubscription = new Subscription();
      spyOn(retirementObservable, 'subscribe').and.callFake(f => {
        f(emptyAccount);
        return retirementSubscription;
      });
      mxObservable = of(emptyMXAccount);
      spyOn(component.subscription, 'add');
      accountServiceSpy.getAccountDataWithoutType.and.returnValue(
        retirementObservable
      );
      mxServiceSpy.getMXAccountData.and.returnValue(mxObservable);
    });
    it('When route would be /accounts/account-details/32323/info', () => {
      component.accountNavContent([
        '',
        'accounts',
        'account-details',
        '32323',
        'info',
      ]);
      expect(accountServiceSpy.getAccountDataWithoutType).toHaveBeenCalledWith(
        '32323'
      );
      expect(component.smallDeviceContent).toEqual({
        title: emptyAccount.planName,
        isBackBtn: true,
        previousPage: '/accounts',
      });
      expect(component.subscription.add).toHaveBeenCalledWith(
        retirementSubscription
      );
    });
    it('When route would be accounts/account-details/570130-isVoyaAccessPlan-96761504EBB324834402E9FA6375018A12B8E3961B7419211BF68C3D9D40279C/info', () => {
      accountServiceSpy.getIsVoyaAccessPlanAccountData.and.returnValue(
        of(emptyAccount)
      );
      component.accountNavContent([
        '',
        'accounts',
        'account-details',
        '570130-isVoyaAccessPlan-96761504EBB324834402E9FA6375018A12B8E3961B7419211BF68C3D9D40279C',
        'info',
      ]);
      expect(
        accountServiceSpy.getIsVoyaAccessPlanAccountData
      ).toHaveBeenCalledWith(
        '570130',
        '96761504EBB324834402E9FA6375018A12B8E3961B7419211BF68C3D9D40279C'
      );
      expect(component.smallDeviceContent).toEqual({
        title: emptyAccount.planName,
        isBackBtn: true,
        previousPage: '/accounts',
      });
    });
    it('When route would be /accounts/mxdetails-account/ACT-8fa39e08-8981-4c4f-8910-177e53836bd1', () => {
      component.isMxSubscribe = true;
      component.accountNavContent([
        '',
        'accounts',
        'mxdetails-account',
        'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      ]);
      expect(mxServiceSpy.getMXAccountData).toHaveBeenCalledWith(
        'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1'
      );
      expect(component.smallDeviceContent).toEqual({
        title: emptyMXAccount.name,
        isBackBtn: true,
        previousPage: '/accounts',
      });
      expect(component.isMxSubscribe).toEqual(false);
    });
    it('When route would be /accounts/spending-widget', () => {
      component.accountNavContent(['', 'accounts', 'spending-widget']);
      expect(component.smallDeviceContent).toEqual({
        title: 'spending',
        isBackBtn: true,
        previousPage: '/accounts',
      });
    });
    it('When route would be /accounts/add-accounts', () => {
      component.accountNavContent(['', 'accounts', 'add-accounts']);
      expect(component.smallDeviceContent).toEqual({
        title: 'add accounts',
        isBackBtn: true,
        previousPage: '/accounts',
      });
    });
    it('When route would be /accounts/all-account/summary', () => {
      component.content = content;
      component.accountNavContent(['', 'accounts', 'all-account', 'summary']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Accounts',
      });
    });
  });

  describe('coveragesNavContent', () => {
    const benefitEnrolledData = {
      name: 'name',
      coverage: 0,
      premium: 5,
      premiumFrequency: 'premiumFrequnency',
      deductible: 10,
      type: 'type',
      id: '32323',
      deductibleObj: undefined,
      coverage_levels: undefined,
      coverageType: 'coverageType',
      first_name: 'first_name',
      benefit_type_title: 'benefit_type_title',
    };
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      benefitsServiceSpy.getBenefitEnrolledData.and.returnValue(
        of(benefitEnrolledData)
      );
      component.smallDeviceContent = {};
    });
    it('When route would be /coverages', () => {
      component.content = content;
      component.coveragesNavContent(['', 'coverages']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Coverages',
      });
    });
    it('When route would be /coverages/view-plans/32323/details', () => {
      component.coveragesNavContent([
        '',
        'coverages',
        'view-plans',
        '32323',
        'details',
      ]);
      expect(benefitsServiceSpy.getBenefitEnrolledData).toHaveBeenCalledWith(
        '32323'
      );
      expect(component.smallDeviceContent).toEqual({
        title: benefitEnrolledData.name,
        isBackBtn: true,
        previousPage: '/coverages/all-coverages/plans',
      });
      expect(component.subscription.add).toHaveBeenCalled();
    });
  });

  describe('moreNavContent', () => {
    beforeEach(() => {
      component.smallDeviceContent = {};
    });
    it('When route would be /more', () => {
      component.moreNavContent(['', 'more']);
      expect(component.smallDeviceContent).toEqual({
        title: 'More',
      });
    });

    it('When route would be /more/notification-settings', () => {
      component.moreNavContent(['', 'more', 'notification-settings']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Notification Settings',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/summary', () => {
      component.moreNavContent(['', 'more', 'summary']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Summary of Benefits',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/contact-a-coach', () => {
      component.moreNavContent(['', 'more', 'contact-a-coach']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Contact a Professional',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/privacy', () => {
      component.moreNavContent(['', 'more', 'privacy']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Privacy',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/feedback', () => {
      component.moreNavContent(['', 'more', 'feedback']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Feedback',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/help', () => {
      spyOn(component, 'helpNavContent');
      component.moreNavContent(['', 'more', 'help']);
      expect(component.helpNavContent).toHaveBeenCalledWith([
        '',
        'more',
        'help',
      ]);
    });
    it('When route would be /more/account-and-personal-info', () => {
      spyOn(component, 'accountAndPersonalNavContent');
      component.moreNavContent(['', 'more', 'account-and-personal-info']);
      expect(component.accountAndPersonalNavContent).toHaveBeenCalledWith([
        '',
        'more',
        'account-and-personal-info',
      ]);
    });
  });

  describe('helpNavContent', () => {
    beforeEach(() => {
      component.smallDeviceContent = {};
    });
    it('when route would be /more/help', () => {
      component.helpNavContent(['', 'more', 'help']);
      expect(component.smallDeviceContent).toEqual({
        title: 'Help',
        isBackBtn: true,
        previousPage: '/more/menu',
      });
    });
    describe('when route would be /more/help/help-content', () => {
      it('when getCategoryData has data', () => {
        myVoyageHeaderServiceSpy.getCategoryData.and.returnValue({
          title: 'title',
          questionList: [
            {
              question: 'question',
              description: 'description',
            },
          ],
        });
        component.helpNavContent(['', 'more', 'help', 'help-content']);
        expect(component.smallDeviceContent).toEqual({
          title: 'title',
          isBackBtn: true,
          previousPage: '/more/help',
        });
      });
      it('when getCategoryData has no data', () => {
        myVoyageHeaderServiceSpy.getCategoryData.and.returnValue(undefined);
        component.helpNavContent(['', 'more', 'help', 'help-content']);
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/more/help');
      });
    });
  });

  describe('accountAndPersonalNavContent', () => {
    beforeEach(() => {
      component.smallDeviceContent = {};
      component.content = content;
    });
    it('When route would be /more/account-and-personal-info', () => {
      component.accountAndPersonalNavContent([
        '',
        'more',
        'account-and-personal-info',
      ]);
      expect(component.smallDeviceContent).toEqual({
        title: 'Personal & Account Info',
        isBackBtn: true,
        previousPage: '/more',
      });
    });
    it('When route would be /more/account-and-personal-info/edit-display-name', () => {
      component.accountAndPersonalNavContent([
        '',
        'more',
        'account-and-personal-info',
        'edit-display-name',
      ]);
      expect(component.smallDeviceContent).toEqual({
        title: 'Edit Display Name',
        isBackBtn: true,
        previousPage: '/more/account-and-personal-info/account-info',
      });
    });
    it('When route would be /more/account-and-personal-info/edit-email', () => {
      component.accountAndPersonalNavContent([
        '',
        'more',
        'account-and-personal-info',
        'edit-email',
      ]);
      expect(component.smallDeviceContent).toEqual({
        title: 'Edit Email',
        isBackBtn: true,
        previousPage: '/more/account-and-personal-info/account-info',
      });
    });
    it('When route would be /more/account-and-personal-info/edit-phone', () => {
      component.accountAndPersonalNavContent([
        '',
        'more',
        'account-and-personal-info',
        'edit-phone',
      ]);
      expect(component.smallDeviceContent).toEqual({
        title: 'Edit/Add Mobile',
        isBackBtn: true,
        previousPage: '/more/account-and-personal-info/account-info',
      });
    });
  });

  describe('handleBackClick', () => {
    it('should publish leave journey if the selected tab is life events', () => {
      component.selectedTab = 'LIFE_EVENTS';
      component.handleBackClick(undefined);
      expect(journeyServiceSpy.publishLeaveJourney).toHaveBeenCalled();
    });

    it('should not publish leave journey if the selected tab is not life events', () => {
      component.selectedTab = 'COVERAGES';
      component.handleBackClick(undefined);
      expect(journeyServiceSpy.publishLeaveJourney).not.toHaveBeenCalled();
    });

    it('when url would be not null', () => {
      component.handleBackClick('/accounts');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/accounts');
    });
    it('when url would be null', () => {
      component.handleBackClick('');
      expect(headerTypeServiceSpy.backToPrevious).toHaveBeenCalled();
    });
  });

  describe('checkForNewMsgs', () => {
    beforeEach(() => {
      checkForNewMsgsSpy.and.callThrough();
      component.numberOfNotifications = 0;
    });

    it('should subscribe to get new messages', async () => {
      const notificationCount = {newNotificationCount: 6};
      const notificationCount$ = of(notificationCount);
      myVoyageHeaderServiceSpy.getNotificationCount.and.returnValue(
        notificationCount$
      );
      const subscription = new Subscription();
      spyOn(notificationCount$, 'subscribe').and.callFake(f => {
        f(notificationCount);
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      component.numberOfNotifications = undefined;
      component.checkForNewMsgs();
      expect(myVoyageHeaderServiceSpy.getNotificationCount).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
      expect(component.numberOfNotifications).toEqual(6);
    });
  });

  it('goToNotification', () => {
    component.rootPath = 'journeys-list';
    component.numberOfNotifications = 5;
    component.goToNotification();
    expect(component.numberOfNotifications).toEqual(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['notification'], {
      queryParams: {previousRootPath: 'journeys-list'},
    });
  });

  describe('fetchCurrentRootPath', () => {
    describe('for journeys page', () => {
      it('when route would be journeys/journey/1/steps?journeyType=recommended', () => {
        component.fetchCurrentRootPath(
          '/journeys/journey/1/steps?journeyType=recommended'
        );
        expect(component.rootPath).toEqual('');
      });
      it('when route would be journeys/journey/1/overview?journeyType=recommended', () => {
        component.fetchCurrentRootPath(
          '/journeys/journey/1/overview?journeyType=recommended'
        );
        expect(component.rootPath).toEqual('journeys-list');
      });
    });
    it('for more page', () => {
      component.fetchCurrentRootPath('/more');
      expect(component.rootPath).toEqual('more');
    });
    it('for notification page', () => {
      component.numberOfNotifications = 10;
      component.fetchCurrentRootPath('/notification');
      expect(component.rootPath).toEqual('notification');
      expect(component.numberOfNotifications).toEqual(0);
    });
  });

  it('ngOnDestroy', () => {
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
