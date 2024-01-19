import {TestBed, waitForAsync} from '@angular/core/testing';
import {QualtricsService, QUALTRICS_EVAL_INTERVAL} from './qualtrics.service';
import {
  QUALTRICS_BRAND_ID,
  QUALTRICS_PROJECT_ID,
  QUALTRICS_EXT_REF_ID,
} from './constants/qualtrics-config';
import {QualtricsProperty} from './constants/qualtrics-properties.enum';
import {QualtricsIntercept} from './constants/qualtrics-intercepts.enum';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {Platform} from '@ionic/angular';

describe('QualtricsService', () => {
  let service: QualtricsService;
  const endpoints = endPoints;
  let qualtricsSpy;
  let routerSpy;
  let utilityServiceSpy;
  let baseServiceSpy;
  let subSpy;
  let eventsSpy;
  let platformSpy;

  beforeEach(
    waitForAsync(() => {
      eventsSpy = jasmine.createSpyObj('Events', ['subscribe']);
      routerSpy = jasmine.createSpyObj('Router', [''], {
        events: eventsSpy,
      });
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['get']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'appendBaseUrlToEndpoints',
        'getIsWeb',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);

      platformSpy = jasmine.createSpyObj('Platform', ['is']);

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: Platform, useValue: platformSpy},
        ],
      });
      service = TestBed.inject(QualtricsService);

      qualtricsSpy = jasmine.createSpyObj('Qualtrics', [
        'initialize',
        'setProperty',
        'registerViewVisit',
        'evaluate',
        'evaluateInterceptId',
      ]);
      subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      service.subscription = subSpy;

      service.qualtrics = qualtricsSpy;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeWeb', () => {
    it('should call appendBaseUrlToEndpoints if web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      service.initializeWeb();
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalled();
    });

    it('should not call appendBaseUrlToEndpoints if not web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);

      service.initializeWeb();

      expect(utilityServiceSpy.appendBaseUrlToEndpoints).not.toHaveBeenCalled();
    });
  });

  describe('initializeMobile', () => {
    beforeEach(() => {
      spyOn(service, 'setUpRouteListener');
      spyOn(service, 'startEvaluationTimer');
    });

    it('should call CapQualtrics initialize and if success, set up route listener, and start evaluation timer ', async () => {
      qualtricsSpy.initialize.and.returnValue(
        Promise.resolve({
          success: true,
          message: '',
        })
      );

      await service.initializeMobile();

      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        endpoints
      );
      expect(qualtricsSpy.initialize).toHaveBeenCalledWith({
        brandID: QUALTRICS_BRAND_ID,
        projectID: QUALTRICS_PROJECT_ID,
        extRefID: QUALTRICS_EXT_REF_ID,
      });
      expect(service.setUpRouteListener).toHaveBeenCalled();
      expect(service.startEvaluationTimer).toHaveBeenCalled();
    });

    it('should not set up route listener or start evaluation timer if initialization was not successful', async () => {
      qualtricsSpy.initialize.and.returnValue(
        Promise.resolve({
          success: false,
          message: '',
        })
      );

      await service.initializeMobile();

      expect(service.setUpRouteListener).not.toHaveBeenCalled();
      expect(service.startEvaluationTimer).not.toHaveBeenCalled();
    });
  });

  describe('setUpRouteListener', () => {
    it('should listen for changing routes', async () => {
      await service.setUpRouteListener();
      expect(eventsSpy.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('routeChanged', () => {
    beforeEach(() => {
      spyOn(service, 'registerViewVisit');
      spyOn(service, 'setProperty');
    });

    it('should register view visit if instance of NavigationEnd', () => {
      service.routeChanged(new NavigationEnd(0, 'test/url', 'test/url/after'));

      expect(service.registerViewVisit).toHaveBeenCalledWith('test/url/after');
      expect(service.setProperty).toHaveBeenCalledWith(
        QualtricsProperty.PAGE_NAME,
        'test/url/after'
      );
    });

    it('should register view visit if not instance of NavigationEnd', () => {
      service.routeChanged(new RouterEvent(0, 'test/url'));

      expect(service.registerViewVisit).not.toHaveBeenCalledWith('test/url');
      expect(service.setProperty).not.toHaveBeenCalledWith(
        QualtricsProperty.PAGE_NAME,
        'test/url'
      );
    });
  });

  describe('startEvaluationTimer', () => {
    it('should clear old timer and start new one', () => {
      spyOn(window, 'setInterval');
      spyOn(service, 'clearEvaluationTimer');

      service.startEvaluationTimer();
      expect(service.clearEvaluationTimer).toHaveBeenCalled();
      expect(window.setInterval).toHaveBeenCalledWith(
        jasmine.any(Function),
        QUALTRICS_EVAL_INTERVAL
      );
    });
  });

  describe('clearEvaluationTimer', () => {
    beforeEach(() => {
      spyOn(window, 'clearInterval');
    });

    it('should clear timer if it exists', () => {
      service.evalTimer = setTimeout(() => {
        console.log('test');
      }, 1000);

      service.clearEvaluationTimer();
      expect(window.clearInterval).toHaveBeenCalledWith(service.evalTimer);
    });

    it('should not clear timer if it does not exists', () => {
      service.evalTimer = undefined;

      service.clearEvaluationTimer();
      expect(window.clearInterval).not.toHaveBeenCalledWith(service.evalTimer);
    });
  });

  describe('getUserProperties', () => {
    let userProps;
    beforeEach(() => {
      userProps = {
        clientDomain: 'testDomain',
        clientId: 'testClientId',
        clientName: 'testClientName',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
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
      };
      baseServiceSpy.get.and.returnValue(Promise.resolve(userProps));
    });

    it('should call baseservice.get if userProps is not set', async () => {
      const result = await service.getUserProperties();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/myvoyageenabled/qualtrics'
      );
      expect(result).toEqual(userProps);
    });

    it('should not call baseservice.get if userProps is set', async () => {
      service.userProperties = userProps;

      const result = await service.getUserProperties();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(userProps);
    });
  });

  describe('setUserProperties', () => {
    let propSpy;
    let part: Participant;

    beforeEach(() => {
      propSpy = spyOn(service, 'setProperty');
      part = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        profileId: 'profileId',
      } as Participant;
    });

    it('should get user properties and set qualtrics properties, and set platform to ios if ios device', async () => {
      spyOn(service, 'getUserProperties').and.returnValue(
        Promise.resolve({
          clientDomain: 'testDomain',
          clientId: 'testClientId',
          clientName: 'testClientName',
          email: 'test@test.com',
          myVoyageEnabled: true,
          enableMyVoyage: 'Y',
          firstTimeLogin: true,
          mobile: '1112223333',
          partyId: '9999',
          appId: 'myVoyage',
          currentPlan: {
            planId: '',
            active: false,
            benefitsAdminSystem: '',
          },
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
        })
      );
      platformSpy.is.and.returnValue(true);
      await service.setUserProperties(part);

      expect(propSpy).toHaveBeenCalledTimes(9);

      expect(propSpy.calls.all()[0].args[0]).toEqual(QualtricsProperty.APP_ID);
      expect(propSpy.calls.all()[0].args[1]).toEqual('myVoyage');

      expect(propSpy.calls.all()[1].args[0]).toEqual(
        QualtricsProperty.CLIENT_ID
      );
      expect(propSpy.calls.all()[1].args[1]).toEqual('testClientId');

      expect(propSpy.calls.all()[2].args[0]).toEqual(QualtricsProperty.PLAN);
      expect(propSpy.calls.all()[2].args[1]).toEqual('123,456');

      expect(propSpy.calls.all()[3].args[0]).toEqual(
        QualtricsProperty.PARTY_ID
      );
      expect(propSpy.calls.all()[3].args[1]).toEqual('9999');

      expect(propSpy.calls.all()[4].args[0]).toEqual(QualtricsProperty.EMAIL);
      expect(propSpy.calls.all()[4].args[1]).toEqual('test@test.com');

      expect(propSpy.calls.all()[5].args[0]).toEqual(QualtricsProperty.PHONE);
      expect(propSpy.calls.all()[5].args[1]).toEqual('1112223333');

      expect(propSpy.calls.all()[6].args[0]).toEqual(
        QualtricsProperty.FIRST_TIME_USER
      );
      expect(propSpy.calls.all()[6].args[1]).toEqual('Y');

      expect(propSpy.calls.all()[7].args[0]).toEqual(
        QualtricsProperty.FIRST_NAME
      );
      expect(propSpy.calls.all()[7].args[1]).toEqual('Joseph');

      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(propSpy.calls.all()[8].args[0]).toEqual(
        QualtricsProperty.DEVICE_TYPE
      );
      expect(propSpy.calls.all()[8].args[1]).toEqual('ios');
    });

    it('should get user props and set first time login to N if its false', async () => {
      spyOn(service, 'getUserProperties').and.returnValue(
        Promise.resolve({
          clientDomain: 'testDomain',
          clientId: 'testClientId',
          clientName: 'testClientName',
          email: 'test@test.com',
          myVoyageEnabled: true,
          enableMyVoyage: 'Y',
          firstTimeLogin: false,
          mobile: '1112223333',
          partyId: '9999',
          appId: 'myVoyage',
          currentPlan: {
            planId: '',
            active: false,
            benefitsAdminSystem: '',
          },
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
        })
      );

      platformSpy.is.and.returnValue(true);
      await service.setUserProperties(part);

      expect(propSpy.calls.all()[6].args[0]).toEqual(
        QualtricsProperty.FIRST_TIME_USER
      );
      expect(propSpy.calls.all()[6].args[1]).toEqual('N');
    });

    it('should get user properties and set qualtrics properties, and set platform to ios if ios device', async () => {
      spyOn(service, 'getUserProperties').and.returnValue(
        Promise.resolve({
          clientDomain: 'testDomain',
          clientId: 'testClientId',
          clientName: 'testClientName',
          email: 'test@test.com',
          myVoyageEnabled: true,
          enableMyVoyage: 'Y',
          firstTimeLogin: false,
          mobile: '1112223333',
          partyId: '9999',
          appId: 'myVoyage',
          currentPlan: {
            planId: '',
            active: false,
            benefitsAdminSystem: '',
          },
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
        })
      );

      platformSpy.is.and.returnValue(false);
      await service.setUserProperties(part);

      expect(propSpy.calls.all()[8].args[0]).toEqual(
        QualtricsProperty.DEVICE_TYPE
      );
      expect(propSpy.calls.all()[8].args[1]).toEqual('web');
    });
  });

  describe('setProperty', () => {
    it('should call CapQualtrics setProperty', () => {
      service.setProperty(QualtricsProperty.CLIENT_ID, 'abcd');

      expect(qualtricsSpy.setProperty).toHaveBeenCalledWith({
        propName: QualtricsProperty.CLIENT_ID,
        propVal: 'abcd',
      });
    });
  });

  describe('registerViewVisit', () => {
    it('should call CapQualtrics registerViewVisit', () => {
      service.registerViewVisit('view_a');

      expect(qualtricsSpy.registerViewVisit).toHaveBeenCalledWith({
        viewName: 'view_a',
      });
    });
  });

  describe('evaluateProject', () => {
    it('should call CapQualtrics evaluate with bypass = false', () => {
      service.evaluateProject();

      expect(qualtricsSpy.evaluate).toHaveBeenCalledWith({
        bypass: false,
      });
    });

    it('should call CapQualtrics evaluate with bypass = true', () => {
      service.evaluateProject(true);

      expect(qualtricsSpy.evaluate).toHaveBeenCalledWith({
        bypass: true,
      });
    });
  });

  describe('evaluateInterceptId', () => {
    it('should call CapQualtrics evaluateInterceptId with interceptId and bypass = false', () => {
      service.evaluateInterceptId(QualtricsIntercept.FEEDBACK_INTERCEPT);

      expect(qualtricsSpy.evaluateInterceptId).toHaveBeenCalledWith({
        interceptId: QualtricsIntercept.FEEDBACK_INTERCEPT,
        bypass: false,
      });
    });

    it('should call CapQualtrics evaluateInterceptId with interceptId and bypass = true', () => {
      service.evaluateInterceptId(QualtricsIntercept.FEEDBACK_INTERCEPT, true);

      expect(qualtricsSpy.evaluateInterceptId).toHaveBeenCalledWith({
        interceptId: QualtricsIntercept.FEEDBACK_INTERCEPT,
        bypass: true,
      });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(service, 'clearEvaluationTimer');
    });

    it('should not call unsubscribe if the subscription is null, and clear timer', () => {
      service.subscription = null;

      service.ngOnDestroy();
      expect(subSpy.unsubscribe).not.toHaveBeenCalled();
      expect(service.clearEvaluationTimer).toHaveBeenCalled();
    });

    it('should unsubscribe if there is a subscription', () => {
      service.ngOnDestroy();
      expect(subSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
