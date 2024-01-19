import {HttpClientModule} from '@angular/common/http';
import {fakeAsync, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';
import {QualtricsService} from '@shared-lib/services/qualtrics//qualtrics.service';
import {ErrorService} from './modules/shared/service/error-service/error.service';
import {of} from 'rxjs';
import {PlatformService} from './modules/shared/service/platform/platform.service';
import {URLOpenListenerEvent} from '@capacitor/app';
import {AuthenticationService} from './modules/shared/service/authentication/authentication.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';

describe('AppComponent', () => {
  let routerSpy;
  let fixture;
  let app;
  let addEventListenerSpy;
  let utilityServiceSpy;
  let googleAnalyticServiceSpy;
  let qualtricsServiceSpy;
  let errorServiceSpy;
  let screenReadingSpy;
  let platformServiceSpy;
  let authServiceSpy;
  let backButtonSpy;
  let captureDeepLinkEventSpy;
  let eventTrackingServiceSpy;
  let mockUrl;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'setStatusBarStyleLight',
        'setEnvironment',
        'getQueryParams',
      ]);
      googleAnalyticServiceSpy = jasmine.createSpyObj(
        'GoogleAnalyticsService',
        ['listenForEvents', 'firebaseAnalyticsTracking']
      );
      qualtricsServiceSpy = jasmine.createSpyObj('QualtricsService', [
        'initializeMobile',
      ]);
      errorServiceSpy = jasmine.createSpyObj('ErrorService', [
        'registerErrorListener',
        'initialize',
      ]);
      platformServiceSpy = jasmine.createSpyObj(
        'Platform',
        ['ready', 'backButton', 'initialize', 'keyboardDidShow', 'isIos'],
        {
          onReady$: of(jasmine.createSpyObj('resume', ['subscribe'])),
          onResume$: of(jasmine.createSpyObj('resume', ['subscribe'])),
        }
      );
      authServiceSpy = jasmine.createSpyObj('AuthService', [
        'didLaunchWithURL',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTrackingAfterAuthorized',
      ]);
      backButtonSpy = jasmine.createSpyObj('BackButton', ['unsubscribe']);
      platformServiceSpy.backButton.and.returnValue(backButtonSpy);
      platformServiceSpy.keyboardDidShow.and.returnValue(true);
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email&redirect_route=/home/guidelines';
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: GoogleAnalyticsService, useValue: googleAnalyticServiceSpy},
          {provide: QualtricsService, useValue: qualtricsServiceSpy},
          {provide: ErrorService, useValue: errorServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        ],
        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          FormsModule,
          CommonModule,
          RouterTestingModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    addEventListenerSpy = spyOn(window, 'addEventListener');
    screenReadingSpy = spyOn(app, 'screenReading');
    captureDeepLinkEventSpy = spyOn(app, 'captureDeepLinkEvent');
    app.keyboard = jasmine.createSpyObj('keyboard', ['hide']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  describe('listenForAppUrlOpen', () => {
    let event: URLOpenListenerEvent;
    let appSpy;
    beforeEach(() => {
      appSpy = jasmine.createSpyObj('App', ['addListener']);
      appSpy.addListener.and.callFake((e, f) => {
        expect(e).toEqual('appUrlOpen');
        f(event);

        return undefined;
      });
      app.app = appSpy;
      event = {url: ''};
    });

    it('should call addListener', () => {
      app.listenForAppUrlOpen();
      expect(app.app.addListener).toHaveBeenCalledWith(
        'appUrlOpen',
        jasmine.any(Function)
      );
    });

    it('should not call didLaunchWithURL if url does not contain redirect_route', () => {
      event.url =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html';
      app.listenForAppUrlOpen();
      expect(authServiceSpy.didLaunchWithURL).not.toHaveBeenCalled();
      expect(captureDeepLinkEventSpy).not.toHaveBeenCalled();
    });

    it('should call didLaunchWithURL with route containing &', () => {
      event.url =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?param2=test&redirect_route=/journeys/journey/1/steps?journeyType=all';
      app.listenForAppUrlOpen();
      expect(authServiceSpy.didLaunchWithURL).toHaveBeenCalledWith(
        '/journeys/journey/1/steps?journeyType=all&param2=test'
      );
      expect(captureDeepLinkEventSpy).toHaveBeenCalledWith(event.url);
    });

    it('should call didLaunchWithURL with route containing & with no ?', () => {
      event.url =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?redirect_route=/journeys/journey/1/steps&param2=test';
      app.listenForAppUrlOpen();
      expect(authServiceSpy.didLaunchWithURL).toHaveBeenCalledWith(
        '/journeys/journey/1/steps?param2=test'
      );
      expect(captureDeepLinkEventSpy).toHaveBeenCalledWith(event.url);
    });

    it('should call navigateByUrl with route without params', () => {
      event.url =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?redirect_route=accounts/all-account/summary';
      app.listenForAppUrlOpen();
      expect(authServiceSpy.didLaunchWithURL).toHaveBeenCalledWith(
        'accounts/all-account/summary'
      );
      expect(captureDeepLinkEventSpy).toHaveBeenCalledWith(event.url);
    });
  });

  describe('ngOnInit', () => {
    it('should add event listener for keyboard to focus the element', () => {
      addEventListenerSpy.and.callFake((e, f) => {
        expect(e).toEqual('keyboardDidShow');
        spyOn(app, 'focusElement');
        window.setTimeout = jasmine.createSpy() as any;
        (window.setTimeout as any).and.callFake((func, t) => {
          func();
          expect(app.focusElement).toHaveBeenCalled();
          expect(t).toEqual(0);
        });
        f();
        expect(window.setTimeout).toHaveBeenCalled();
      });
      expect(platformServiceSpy.initialize).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(googleAnalyticServiceSpy.listenForEvents).toHaveBeenCalled();
      expect(
        googleAnalyticServiceSpy.firebaseAnalyticsTracking
      ).toHaveBeenCalled();
      expect(qualtricsServiceSpy.initializeMobile).toHaveBeenCalled();
      expect(errorServiceSpy.initialize).toHaveBeenCalled();
      expect(app.screenReading).toHaveBeenCalled();
    });
  });

  describe('screenReading', () => {
    let sr;
    beforeEach(() => {
      sr = jasmine.createSpyObj('sr', [
        'addListener',
        'isEnabled',
        'speak',
        'removeAllListeners',
      ]);
      screenReadingSpy.and.callThrough();
      sr.addListener.and.callFake((e, f) => {
        f(e);
        return Promise.resolve(true);
      });
    });
    it('should call sr.speak if sr is enabled', async () => {
      sr.isEnabled.and.returnValue(Promise.resolve(true));

      await app.screenReading(sr);

      expect(sr.addListener).toHaveBeenCalled();
      expect(sr.isEnabled).toHaveBeenCalled();
      expect(sr.speak).toHaveBeenCalledWith({value: 'Welcome to Voya.'});
    });
    it('should not call sr.speak if sr is not enabled', async () => {
      sr.isEnabled.and.returnValue(Promise.resolve(false));

      await app.screenReading(sr);

      expect(sr.addListener).toHaveBeenCalled();
      expect(sr.isEnabled).toHaveBeenCalled();
      expect(sr.speak).not.toHaveBeenCalledWith();
    });
  });

  describe('backButtonEvent', () => {
    let event;
    beforeEach(() => {
      event = {
        detail: {
          register: jasmine.createSpy(),
        },
      };
      addEventListenerSpy.and.callFake((e, f) => {
        f(event);
      });
      event.detail.register.and.callFake((e, f) => {
        f(e);
      });
    });
    it('Should called navigateByUrl', () => {
      app.backButtonEvent();
      expect(window.addEventListener).toHaveBeenCalled();
      expect(event.detail.register).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('focusElement', () => {
    it('should unfocus and focus the element if there is a focused element', () => {
      const focusedElMock = jasmine.createSpyObj('focused', ['focus', 'blur']);
      spyOn(document, 'querySelector').and.returnValue(focusedElMock);
      app.focusElement();
      expect(document.querySelector).toHaveBeenCalledWith(':focus');
      expect(focusedElMock.blur).toHaveBeenCalled();
      expect(focusedElMock.focus).toHaveBeenCalled();
    });

    it('should not unfocus and focus the element if there is no focused element', () => {
      spyOn(document, 'querySelector').and.returnValue(undefined);
      app.focusElement();
      expect(document.querySelector).toHaveBeenCalledWith(':focus');
    });
  });

  describe('hideKeypad', () => {
    it('should hide  keyboard', fakeAsync(() => {
      app.hideKeypad();
      tick(1000);
      app.logScrollStart();
      expect(app.keyboard.hide).toHaveBeenCalled();
    }));
  });

  describe('logScrollStart', () => {
    it('should hide keyboard', () => {
      app.logScrollStart();
      expect(app.keyboard.hide).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should unsubscribe from backbutton event', () => {
      app.ionViewWillLeave();
      expect(backButtonSpy.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('captureDeepLinkEvent', () => {
    let eventTrackingEvent: EventTrackingEvent;
    let mockQueryParams: Record<string, string>;
    beforeEach(() => {
      captureDeepLinkEventSpy.and.callThrough();
      eventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [],
      };
    });
    it('should track the event when source and redirect_route is defined', () => {
      mockQueryParams = {
        source: 'email',
        redirect_route: '/home/guidelines',
      };
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email&redirect_route=/home/guidelines';
      eventTrackingEvent.passThruAttributes = [
        {
          attributeName: 'subType',
          attributeValue: 'DeepLink',
        },
        {
          attributeName: 'source',
          attributeValue: mockQueryParams.source,
        },
        {
          attributeName: 'redirect_route',
          attributeValue: mockQueryParams.redirect_route,
        },
      ];
      utilityServiceSpy.getQueryParams.and.returnValue(mockQueryParams);
      app.captureDeepLinkEvent(mockUrl);
      expect(utilityServiceSpy.getQueryParams).toHaveBeenCalledWith(mockUrl);
      expect(
        eventTrackingServiceSpy.eventTrackingAfterAuthorized
      ).toHaveBeenCalledWith(eventTrackingEvent);
    });
    it('should track the event when only source is defined', () => {
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html?source=email';
      mockQueryParams = {
        source: 'email',
      };
      eventTrackingEvent.passThruAttributes = [
        {
          attributeName: 'subType',
          attributeValue: 'DeepLink',
        },
        {
          attributeName: 'source',
          attributeValue: mockQueryParams.source,
        },
      ];
      utilityServiceSpy.getQueryParams.and.returnValue(mockQueryParams);
      app.captureDeepLinkEvent(mockUrl);
      expect(utilityServiceSpy.getQueryParams).toHaveBeenCalledWith(mockUrl);
      expect(
        eventTrackingServiceSpy.eventTrackingAfterAuthorized
      ).toHaveBeenCalledWith(eventTrackingEvent);
    });
    it('should not track the event when source is undefined', () => {
      mockQueryParams = undefined;
      mockUrl =
        'https://myvoyage.voya.com/myvoyageui/assets/html/redirect.html';
      utilityServiceSpy.getQueryParams.and.returnValue(mockQueryParams);
      app.captureDeepLinkEvent(mockUrl);
      expect(utilityServiceSpy.getQueryParams).toHaveBeenCalledWith(mockUrl);
      expect(
        eventTrackingServiceSpy.eventTrackingAfterAuthorized
      ).not.toHaveBeenCalled();
    });
  });
});
