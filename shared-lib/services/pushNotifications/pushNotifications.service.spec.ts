import {TestBed, waitForAsync} from '@angular/core/testing';
import {AuthenticationService} from '../../../mobile/src/app/modules/shared/service/authentication/authentication.service';
import {PushNotificationsService} from './pushNotifications.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {SharedUtilityService} from '../utility/utility.service';

describe('PushNotificationsService', () => {
  let service: PushNotificationsService;
  let mcSDKSpy;
  let authServiceSpy;
  let url;
  let eventTrackingServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mcSDKSpy = jasmine.createSpyObj('MCCordovaPlugin', [
        'setContactKey',
        'setOnNotificationOpenedListener',
      ]);
      authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
        'didLaunchWithURL',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTrackingAfterAuthorized',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          PushNotificationsService,
          {provide: AuthenticationService, useValue: authServiceSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      });
      window.MCCordovaPlugin = mcSDKSpy;
      spyOn(window, 'alert');
      url = '/journeys';
      mcSDKSpy.setOnNotificationOpenedListener.and.callFake(f =>
        f({values: {url: url}})
      );
      service = TestBed.inject(PushNotificationsService);
    })
  );

  describe('constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set up listener to call didLaunchWithUrl', () => {
      expect(mcSDKSpy.setOnNotificationOpenedListener).toHaveBeenCalledWith(
        jasmine.any(Function)
      );
      expect(authServiceSpy.didLaunchWithURL).toHaveBeenCalledWith(url);
    });

    it('should not set up mcSDK for web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const service = new PushNotificationsService(
        authServiceSpy,
        eventTrackingServiceSpy,
        utilityServiceSpy
      );
      expect(service['mcSDK']).toBeUndefined();
    });
  });

  describe('setContactKey', () => {
    it('should call sfmc setContactKey', () => {
      const partyId = 'partyId';
      service.setContactKey(partyId);
      expect(mcSDKSpy.setContactKey).toHaveBeenCalledWith(partyId);
    });
  });

  describe('captureCTAClickEvent', () => {
    it('should call eventTrackingAfterAuthorized', async () => {
      const eventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'source',
            attributeValue: 'push',
          },
          {
            attributeName: 'redirect_url',
            attributeValue: url,
          },
        ],
      };
      await service.captureCTAClickEvent(url);
      expect(
        eventTrackingServiceSpy.eventTrackingAfterAuthorized
      ).toHaveBeenCalledWith(eventTrackingEvent);
    });
  });
});
