import {TestBed, waitForAsync} from '@angular/core/testing';
import {endPoints} from '@shared-lib/services/account/constants/endpoints';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventTrackingService} from './event-tracking.service';
import {EventTrackingEvent} from './models/event-tracking.model';
import {Subject} from 'rxjs';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {AuthenticationChange} from '@mobile/app/modules/shared/service/authentication/models/authenticationChange.model';

describe('EventTrackingService', () => {
  let utilityServiceSpy;
  let service: EventTrackingService;
  let baseServiceSpy;
  let subscriberKey;
  let authServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'getBaseUrl',
        'appendBaseUrlToEndpoints',
        'getIsWeb',
      ]);
      baseServiceSpy = jasmine.createSpyObj('BaseService', ['post', 'get']);
      authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: AuthenticationService, useValue: authServiceSpy},
        ],
      });
      service = TestBed.inject(EventTrackingService);
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      service.endPoints = endPoints;
      subscriberKey = {subscriberKey: 'subscriberKey'};
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('eventTracking', () => {
    let postData;
    beforeEach(() => {
      postData = {
        eventName: 'Login Inactivity',
      };
      spyOn(service, 'getSubscriberKey').and.returnValue(subscriberKey);
    });

    it('should call eventTracking post method with subscriber key for web', async () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      baseServiceSpy.post.and.returnValue(Promise.resolve({}));
      await service.eventTracking(postData);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/eventTracking',
        {
          eventName: 'Login Inactivity',
          createdBy: 'myvoyage',
          subscriberKey: subscriberKey.subscriberKey,
          passThruAttributes: [
            {attributeName: 'platform', attributeValue: 'web'},
          ],
        }
      );
    });

    it('should call eventTracking post method with subscriber key for mobile', async () => {
      baseServiceSpy.post.and.returnValue(Promise.resolve({}));
      await service.eventTracking(postData);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/eventTracking',
        {
          eventName: 'Login Inactivity',
          createdBy: 'myvoyage',
          subscriberKey: subscriberKey.subscriberKey,
          passThruAttributes: [
            {attributeName: 'platform', attributeValue: 'mobile'},
          ],
        }
      );
    });
  });

  describe('eventTrackingAfterAuthorized', () => {
    let eventTrackingEvent: EventTrackingEvent;

    beforeEach(() => {
      eventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'source',
            attributeValue: 'push',
          },
          {
            attributeName: 'redirect_url',
            attributeValue: 'url',
          },
        ],
      };
      service['authChangeSubscription'] = undefined;
      spyOn(service, 'eventTracking');
      authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
    });

    it('should track the event right away if already authenticated', async () => {
      await service.eventTrackingAfterAuthorized(eventTrackingEvent);
      expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
      expect(service.eventTracking).toHaveBeenCalledWith(eventTrackingEvent);
    });

    it('should unsubscribe from authChangeSubscription if its already set', async () => {
      service[
        'authChangeSubscription'
      ] = jasmine.createSpyObj('authChangeSubscription', ['unsubscribe']);
      await service.eventTrackingAfterAuthorized(eventTrackingEvent);
      expect(service['authChangeSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from biometricChangeSubscription if its already set', async () => {
      service[
        'biometricChangeSubscription'
      ] = jasmine.createSpyObj('biometricChangeSubscription', ['unsubscribe']);
      await service.eventTrackingAfterAuthorized(eventTrackingEvent);
      expect(
        service['biometricChangeSubscription'].unsubscribe
      ).toHaveBeenCalled();
    });

    it('should track the event once authenticated without biometrics if not already authenticated', async () => {
      authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
      const authChanged = new Subject<AuthenticationChange>();
      authServiceSpy.authenticationChange$ = authChanged;
      const biometricChanged = new Subject<boolean>();
      authServiceSpy.biometricsAuthenticationChange$ = biometricChanged;
      await service.eventTrackingAfterAuthorized(eventTrackingEvent);
      authChanged.next({auth: false, attested: false});
      expect(service.eventTracking).not.toHaveBeenCalled();
      expect(service['authChangeSubscription']).not.toBeUndefined();
      expect(service['biometricChangeSubscription']).not.toBeUndefined();
      authChanged.next({auth: true, attested: false});
      expect(service.eventTracking).not.toHaveBeenCalled();
      expect(service['authChangeSubscription']).not.toBeUndefined();
      expect(service['biometricChangeSubscription']).not.toBeUndefined();
      authChanged.next({auth: false, attested: true});
      expect(service.eventTracking).not.toHaveBeenCalled();
      expect(service['authChangeSubscription']).not.toBeUndefined();
      expect(service['biometricChangeSubscription']).not.toBeUndefined();
      authChanged.next({auth: true, attested: true});
      expect(service.eventTracking).toHaveBeenCalledWith(eventTrackingEvent);
      expect(service['authChangeSubscription']).toBeUndefined();
      expect(service['biometricChangeSubscription']).toBeUndefined();
      authChanged.next({auth: true, attested: true});
      expect(service.eventTracking).toHaveBeenCalledTimes(1);
    });

    it('should track the event once authenticated with biometrics if not already authenticated', async () => {
      authServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
      const authChanged = new Subject<AuthenticationChange>();
      authServiceSpy.authenticationChange$ = authChanged;
      const biometricChanged = new Subject<boolean>();
      authServiceSpy.biometricsAuthenticationChange$ = biometricChanged;
      await service.eventTrackingAfterAuthorized(eventTrackingEvent);
      biometricChanged.next(false);
      expect(service.eventTracking).not.toHaveBeenCalled();
      expect(service['authChangeSubscription']).not.toBeUndefined();
      expect(service['biometricChangeSubscription']).not.toBeUndefined();
      biometricChanged.next(true);
      expect(service.eventTracking).toHaveBeenCalledWith(eventTrackingEvent);
      expect(service['authChangeSubscription']).toBeUndefined();
      expect(service['biometricChangeSubscription']).toBeUndefined();
      biometricChanged.next(true);
      expect(service.eventTracking).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSubscriberKey', () => {
    it('should call base service if the promise is not set', async () => {
      service['subscriberKeyPromise'] = undefined;
      baseServiceSpy.get.and.returnValue(subscriberKey);
      const result = service.getSubscriberKey();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(endPoints.subscriberKey);
      expect(result).toEqual(subscriberKey);
    });

    it('should not call base service if subscriber key is already set', async () => {
      service['subscriberKeyPromise'] = Promise.resolve(subscriberKey);
      const result = await service.getSubscriberKey();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(subscriberKey);
    });
  });
});
