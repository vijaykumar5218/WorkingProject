import {TestBed, waitForAsync} from '@angular/core/testing';
import {WebQualtricsService} from './web-qualtrics.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs';
import {Platform} from '@ionic/angular';

import {AccountService} from '@shared-lib/services/account/account.service';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from '@shared-lib/services/qualtrics/constants/endpoints';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import storageKey from './constants/storage-key.json';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {AccessService} from '@shared-lib/services/access/access.service';

class WebQualtrics {
  start() {
    console.log('Start Method: ');
  }
}

describe('WebQualtricsService', () => {
  let service: WebQualtricsService;
  let sharedUtilityServiceSpy;
  let googleAnalyticsServiceSpy;
  let platformSpy;
  let accountServiceSpy;
  const mockQualtricsUserProps = {
    clientDomain: 'testDomain',
    clientId: 'testClientId',
    clientName: 'testClientName',
    email: 'test@test.com',
    myVoyageEnabled: true,
    firstTimeLogin: true,
    mobile: '1112223333',
    partyId: '9999',
    appId: 'myVoyage',
    planIdList: [
      {
        planId: '123',
        active: true,
        benefitsAdminSystem: 'aaa',
      },
      {
        planId: '456',
        active: true,
        benefitsAdminSystem: 'aaa',
      },
    ],
    currentPlan: {
      planId: '123',
      active: true,
      benefitsAdminSystem: 'aaa',
    },
  };
  let participant: Participant;

  let eventsSpy;
  let routerSpy;
  let environment;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['appendBaseUrlToEndpoints', 'getEnvironment']
      );
      environment = {
        production: false,
        baseUrl: 'http://localhost:4201/',
        tokenBaseUrl: 'https://token.intg.app.voya.com/',
        myvoyaBaseUrl: 'http://localhost:4201/',
        loginBaseUrl: 'https://login.intg.voya.com/',
        savviBaseUrl: 'https://myhealthwealth.intg.voya.com/',
        firebaseConfig: {
          apiKey: 'AIzaSyA1rqtineGMBei3LKwgbvAj80YSXB7mSDw',
          authDomain: 'myvoyage-intg.firebaseapp.com',
          projectId: 'myvoyage-intg',
          storageBucket: 'myvoyage-intg.appspot.com',
          messagingSenderId: '143111284908',
          appId: '1:143111284908:web:0773ef5d5b027651dc1709',
          measurementId: 'G-SKZE188BBR',
        },
        qualtricsStartupUrl:
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/',
      };
      sharedUtilityServiceSpy.getEnvironment.and.returnValue(environment);
      platformSpy = jasmine.createSpyObj('platformSpy', ['is']);
      googleAnalyticsServiceSpy = jasmine.createSpyObj(
        'googleAnalyticsServiceSpy',
        ['getQualtricsUser']
      );
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getParticipant',
      ]);
      participant = {
        firstName: 'VILJAMI',
        lastName: 'AILIN-DP',
        birthDate: '',
        displayName: 'AILIN-DP, VILJAMI',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };
      accountServiceSpy.getParticipant.and.returnValue(participant);
      eventsSpy = of({});
      spyOn(eventsSpy, 'subscribe');
      routerSpy = jasmine.createSpyObj('Router', [''], {
        events: eventsSpy,
      });

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {
            provide: GoogleAnalyticsService,
            useValue: googleAnalyticsServiceSpy,
          },
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: Platform, useValue: platformSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      });
      service = TestBed.inject(WebQualtricsService);
      service.endPoints = endPoints;

      service.storageKey = storageKey;
      service['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.qualtricsStartupUrl).toEqual(
      environment.qualtricsStartupUrl
    );
  });

  describe('initialize', () => {
    beforeEach(
      waitForAsync(() => {
        googleAnalyticsServiceSpy.getQualtricsUser.and.returnValue(
          Promise.resolve(mockQualtricsUserProps)
        );
        spyOn(service, 'checkMyVoyageEnabled');
        accountServiceSpy.getParticipant.and.returnValue(of(participant));
        spyOn(service, 'setUserProperties');
        spyOn(service, 'setUpRouteListener');
      })
    );
    it('should set qualtricsUserProps and participant', async () => {
      service.participant = undefined;
      await service.initialize();
      expect(googleAnalyticsServiceSpy.getQualtricsUser).toHaveBeenCalled();
      expect(service.qualtricsUserProps).toEqual(mockQualtricsUserProps);
      expect(service.checkMyVoyageEnabled).toHaveBeenCalled();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(service.setUpRouteListener).toHaveBeenCalled();
      expect(service.setUserProperties).toHaveBeenCalled();
      expect(service.participant).toEqual(participant);
    });
    it('if feedbackInterceptId arg is defined', async () => {
      await service.initialize('ZN_b3IFCU3urC2BkMK_PWEb');
      expect(service.feedbackInterceptId).toEqual('ZN_b3IFCU3urC2BkMK_PWEb');
    });
    it('if feedbackInterceptId arg is undefined', async () => {
      await service.initialize();
      expect(service.feedbackInterceptId).toEqual('ZN_b3IFCU3urC2BkMK');
    });
  });

  describe('checkMyVoyageEnabled', () => {
    beforeEach(() => {
      service.qualtricsUserProps = mockQualtricsUserProps;
    });
    it('when myVoyageEnabled will be false', async () => {
      const mockData: any = {enableMyVoyage: 'N'};
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockData)
      );
      await service.checkMyVoyageEnabled();
      expect(service.qualtricsUserProps.myVoyageEnabled).toEqual(false);
    });

    it('when myVoyageEnabled will be true', async () => {
      const mockData: any = {enableMyVoyage: 'Y'};
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockData)
      );
      await service.checkMyVoyageEnabled();
      expect(service.qualtricsUserProps.myVoyageEnabled).toEqual(true);
    });
  });

  describe('setUserProperties', () => {
    beforeEach(() => {
      spyOn(service, 'startUpCall');
      service.participant = participant;
      spyOn(Storage.prototype, 'setItem');
      service.feedbackInterceptId = QualtricsIntercept.FEEDBACK_INTERCEPT_WEB;
    });
    describe('when firstTimeLogin would be true', () => {
      beforeEach(() => {
        service.qualtricsUserProps = mockQualtricsUserProps;
        service.qualtricsUserProps.myVoyageEnabled = true;
      });
      it('when platform is ios', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(true)
          .withArgs('android')
          .and.returnValue(false);
        service.setUserProperties();
        expect(Storage.prototype.setItem).toHaveBeenCalled();
        expect(service.startUpCall).toHaveBeenCalledWith(
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_b3IFCU3urC2BkMK&AppId=myVoyage&ClientId=testClientId&PlanId=123%2C456&PartyId=9999&Email=test%40test.com&myVoyageEnabled=true&Phone=1112223333&First_Time_User=Y&First_Name=VILJAMI&deviceType=ios'
        );
      });
      it('when platform is android', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(false)
          .withArgs('android')
          .and.returnValue(true);
        service.setUserProperties();
        expect(Storage.prototype.setItem).toHaveBeenCalled();
        expect(service.startUpCall).toHaveBeenCalledWith(
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_b3IFCU3urC2BkMK&AppId=myVoyage&ClientId=testClientId&PlanId=123%2C456&PartyId=9999&Email=test%40test.com&myVoyageEnabled=true&Phone=1112223333&First_Time_User=Y&First_Name=VILJAMI&deviceType=android'
        );
      });
      it('when platform is web', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(false)
          .withArgs('android')
          .and.returnValue(false);
        service.setUserProperties();
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.CLIENT_ID,
          service.qualtricsUserProps.clientId
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.PARTY_ID,
          service.qualtricsUserProps.partyId
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.Email,
          service.qualtricsUserProps.email
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.MyVoyageEnabled,
          'true'
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.PHONE,
          service.qualtricsUserProps.mobile
        );
        expect(Storage.prototype.setItem).toHaveBeenCalledWith(
          service.storageKey.FIRST_NAME,
          service.participant.firstName
        );
        expect(service.startUpCall).toHaveBeenCalledWith(
          'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_b3IFCU3urC2BkMK&AppId=myVoyage&ClientId=testClientId&PlanId=123%2C456&PartyId=9999&Email=test%40test.com&myVoyageEnabled=true&Phone=1112223333&First_Time_User=Y&First_Name=VILJAMI&deviceType=web'
        );
      });
    });

    it('when firstTimeLogin would be false', () => {
      service.qualtricsUserProps = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        myVoyageEnabled: false,
        firstTimeLogin: false,
        mobile: '1112223333',
        partyId: '9999',
        appId: 'myVoyage',
        planIdList: [
          {
            planId: '123',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
          {
            planId: '456',
            active: true,
            benefitsAdminSystem: 'aaa',
          },
        ],
        currentPlan: {
          planId: '123',
          active: true,
          benefitsAdminSystem: 'aaa',
        },
      };
      platformSpy.is
        .withArgs('ios')
        .and.returnValue(false)
        .withArgs('android')
        .and.returnValue(false);
      service.setUserProperties();
      expect(service.startUpCall).toHaveBeenCalled();
    });
  });

  describe('startUpCall', () => {
    let eleSpy;
    const href =
      'https://znb3ifcu3urc2bkmk-voyafinancial.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_b3IFCU3urC2BkMK&AppId=myVoyage&ClientId=testClientId&PlanId=123%2C456&PartyId=9999&Email=test%40test.com&myVoyageEnabled=true&Phone=1112223333&First_Time_User=Y&First_Name=testFirst&deviceType=web';
    beforeEach(() => {
      eleSpy = jasmine.createSpyObj('eleSpy', ['setAttribute']);
      spyOn(document, 'createElement').and.returnValue(eleSpy);
      spyOn(document.body, 'appendChild');
      service.feedbackInterceptId = QualtricsIntercept.FEEDBACK_INTERCEPT_WEB;
    });
    it('should call WebQualtrics.prototype.start', () => {
      window['WebQualtrics'] = WebQualtrics;
      spyOn(WebQualtrics.prototype, 'start');
      service.startUpCall(href);
      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(eleSpy.setAttribute).toHaveBeenCalledWith(
        'id',
        service.feedbackInterceptId
      );
      expect(document.body.appendChild).toHaveBeenCalledWith(eleSpy);
      expect(WebQualtrics.prototype.start).toHaveBeenCalled();
    });
  });

  describe('setUpRouteListener', () => {
    it('should listen for changing routes', () => {
      service.setUpRouteListener();
      expect(eventsSpy.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('routeChanged', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'setItem');
    });
    it('should set view in localstorage if instance of NavigationEnd', () => {
      service.routeChanged(new NavigationEnd(0, 'test/url', 'test/url/after'));
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        service.storageKey.PAGE_NAME,
        'test/url/after'
      );
    });
    it('should not set view in localstorage if not instance of NavigationEnd', () => {
      service.routeChanged(new RouterEvent(0, 'test/url'));
      expect(Storage.prototype.setItem).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
