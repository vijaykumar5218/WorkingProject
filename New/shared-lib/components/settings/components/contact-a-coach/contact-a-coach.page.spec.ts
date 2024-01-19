import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of, Subscription} from 'rxjs';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ContactACoachPage} from './contact-a-coach.page';
import {Location} from '@angular/common';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Router} from '@angular/router';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('ContactACoachPage', () => {
  let component: ContactACoachPage;
  let fixture: ComponentFixture<ContactACoachPage>;
  let headerTypeServiceSpy;
  let fetchSpy;
  let accountInfoServiceSpy;
  let sharedUtilityServiceSpy;
  let settingsServiceSpy;
  let accountServiceSpy;
  let locationSpy;
  let accessServiceSpy;
  const mockSettingsDisplayFlags = {
    displayContactLink: true,
    suppressAppointment: true,
    pwebStatementUrl:
      'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
  };
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/journeys/contact-a-coach',
            })
          ),
        },
      };
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'openPwebAccountLink',
        'openInAppBrowser',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      accountInfoServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getScreenMessage',
        'getAccountRecovery',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'isMyWorkplaceDashboardEnabled',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('SettingsService', [
        'getSettingsDisplayFlags',
      ]);
      settingsServiceSpy.getSettingsDisplayFlags.and.returnValue(
        Promise.resolve(mockSettingsDisplayFlags)
      );
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(true));
      locationSpy = jasmine.createSpyObj('Location ', ['back']);
      TestBed.configureTestingModule({
        declarations: [ContactACoachPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: Location, useValue: locationSpy},
          {provide: SettingsService, useValue: settingsServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactACoachPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchScreenContent');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const actionOption: ActionOptions = {
      headername: 'Contact a Professional',
      btnleft: true,
      btnright: true,
      buttonLeft: {
        name: '',
        link: 'settings',
      },
      buttonRight: {
        name: '',
        link: 'Notification',
      },
    };
    beforeEach(() => {
      spyOn(component, 'routerNavigation');
    });
    it('should publish header', () => {
      component.ngOnInit();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('should call fetchScreenContent', () => {
      component.ngOnInit();
      expect(component.fetchScreenContent).toHaveBeenCalled();
    });
    it('should set settingsDisplayFlags', async () => {
      await component.ngOnInit();
      expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
      expect(component.settingsDisplayFlags).toEqual(mockSettingsDisplayFlags);
    });
  });

  describe('routerNavigation', () => {
    let subscriptionMock;
    let subscriptionWorkPlaceMock;
    let subscriptionElseMock;
    const mockData = {
      id: 1,
      url: '/journeys/contact-a-coach',
    };
    const mockWorkPlaceData = {
      id: 1,
      url: '/help/contact-a-coach',
    };
    const mockDataWithElseCondition = {
      id: 1,
      url: '/accounts/all-account/summary',
    };
    let observable;
    let workPlaceObservable;
    let observableElseCondition;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      subscriptionMock = new Subscription();
      subscriptionWorkPlaceMock = new Subscription();
      subscriptionElseMock = new Subscription();
      observable = of(mockData);
      workPlaceObservable = of(mockWorkPlaceData);
      observableElseCondition = of(mockDataWithElseCondition);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockData);
        return subscriptionMock;
      });
      spyOn(workPlaceObservable, 'subscribe').and.callFake(f => {
        f(mockWorkPlaceData);
        return subscriptionWorkPlaceMock;
      });
      spyOn(observableElseCondition, 'subscribe').and.callFake(f => {
        f(mockDataWithElseCondition);
        return subscriptionElseMock;
      });
    });
    it('When hideHeader would be true', () => {
      routerSpy.events.pipe.and.returnValue(observable);
      component.routerNavigation();
      expect(component.hideHeader).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(subscriptionMock);
    });
    it('When isWorkplaceDashboard would be true', () => {
      routerSpy.events.pipe.and.returnValue(workPlaceObservable);
      component.routerNavigation();
      expect(component.isWorkplaceDashboard).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(
        subscriptionWorkPlaceMock
      );
    });
  });

  describe('openTimeTapUrl', () => {
    const mockScreenMessage = {
      HealthCoachHeader: 'Health Coach',
      AccountRecoveryDisclosure:
        '<p>Do you use a Financial Aggregation Service?<br />\r\nIf you use an aggregation service such as CashEdge or Personal Capital, you may receive verification code(s) via text or email when your provider accesses this account. If you receive a code, please go to your aggregation service site and reconnect to this account to ensure continued access by your provider.</p>\r\n',
      TimetapURL:
        '<p><a href="https://fpcconsultants.timetap.com/#/" target="_blank">https://fpcconsultants.timetap.com/#/</a></p>\r\n',
      WealthCoachHeader: 'Wealth Coach',
      HealthCoachDesc:
        'Schedule time with a professional today. Same-day appointments are available.\r\n',
      ContactCoachDisclosure: 'TBD',
      WealthCoachDesc:
        'Schedule time with a professional today. Same-day appointments are available.',
    };
    beforeEach(() => {
      component.screenMessage = mockScreenMessage;
      spyOn(window, 'open');
      spyOn(component, 'openPWEBLink');
      spyOn(component, 'openDrirectLink');
    });
    it('when suppressAppointment would be false', () => {
      component.settingsDisplayFlags = {
        displayContactLink: true,
        suppressAppointment: false,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      };
      component.openTimeTapUrl();
      expect(component.openDrirectLink).toHaveBeenCalled();
    });

    it('when suppressAppointment would be true', () => {
      component.settingsDisplayFlags = mockSettingsDisplayFlags;
      component.openTimeTapUrl();
      expect(component.openPWEBLink).toHaveBeenCalled();
    });
  });

  describe('openDrirectLink', () => {
    const mockScreenMessage =
      'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710';
    beforeEach(() => {
      spyOn(window, 'open');
    });
    it('open link in web browser when isWeb would be true', () => {
      component.isWeb = true;
      component.openDrirectLink(mockScreenMessage);
      expect(window.open).toHaveBeenCalledWith(mockScreenMessage, '_blank');
    });

    it('open link in system browser when isWeb would be false', () => {
      component.isWeb = false;
      component.openDrirectLink(mockScreenMessage);
      expect(accountServiceSpy.openInAppBrowser).toHaveBeenCalledWith(
        mockScreenMessage
      );
    });
  });

  describe('openPWEBLink', () => {
    const mockScreenMessage =
      'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710';
    beforeEach(() => {
      spyOn(window, 'open');
    });
    it('open pweb link in decodeURIComponent', () => {
      component.isWeb = true;
      component.openPWEBLink(mockScreenMessage);
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        decodeURIComponent(mockScreenMessage)
      );
    });
  });

  describe('fetchScreenContent', () => {
    let message;
    beforeEach(() => {
      fetchSpy.and.callThrough();
      message = {
        HealthCoachHeader: 'Health Coach',
        AccountRecoveryDisclosure:
          '<p>Do you use a Financial Aggregation Service?<br />\r\nIf you use an aggregation service such as CashEdge or Personal Capital, you may receive verification code(s) via text or email when your provider accesses this account. If you receive a code, please go to your aggregation service site and reconnect to this account to ensure continued access by your provider.</p>\r\n',
        TimetapURL:
          '<p><a href="https://fpcconsultants.timetap.com/#/" target="_blank">https://fpcconsultants.timetap.com/#/</a></p>\r\n',
        WealthCoachHeader: 'Wealth Coach',
        HealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.\r\n',
        ContactCoachDisclosure: 'TBD',
        WealthCoachDesc:
          'Schedule time with a professional today. Same-day appointments are available.',
      };
      accountInfoServiceSpy.getScreenMessage.and.returnValue(
        Promise.resolve(message)
      );
      accountInfoServiceSpy.getScreenMessage.and.returnValue(
        of(message).pipe()
      );
      spyOn(component.subscription, 'add');
    });

    it('should call getScreenMessage from accountInfoService and return message', () => {
      component.screenMessage = undefined;
      component.fetchScreenContent();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.screenMessage).toEqual(message);
    });
  });

  describe('navigateBack', () => {
    it('should call location back', () => {
      component.closeDialog();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
