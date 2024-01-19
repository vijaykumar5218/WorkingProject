import {TestBed} from '@angular/core/testing';
import {PushNotificationsService} from '@shared-lib/services/pushNotifications/pushNotifications.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {HomeService} from '@shared-lib/services/home/home.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {of} from 'rxjs';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {GoogleAnalyticsService} from '../google-Analytics/google.analytics.service';
import {NotificationsSettingService} from '../notification-setting/notification-setting.service';
import {AccessService} from '../access/access.service';
import {ModalController} from '@ionic/angular';
import {SharedUtilityService} from '../utility/utility.service';
import {PreferenceSelectionPage} from '@shared-lib/modules/preferences-selection/preferences-selection.page';
import {SettingsPreferences} from '../notification-setting/models/notification-settings-preferences.model';
import {AccessResult} from '../access/models/access.model';
import {ModalPresentationService} from '../modal-presentation/modal-presentation.service';

describe('HomeService', () => {
  let service: HomeService;
  let eventTrackingServiceSpy;
  let pushNotificationsServiceSpy;
  let qualtricsServiceSpy;
  let accountServiceSpy;
  let googleAnalyticsServiceSpy;
  let settingsServiceSpy;
  let modalControllerSpy;
  let accessServiceSpy;
  let utilityServiceSpy;
  let mockAccessData: AccessResult;
  let modalPresentationServiceSpy;

  beforeEach(() => {
    mockAccessData = {
      clientId: 'KOHLER',
      clientDomain: 'kohler.intg.voya.com',
      clientName: 'Kohler Co. 401(k) Savings Plan',
      planIdList: [
        {
          planId: '623040',
        },
      ],
      firstTimeLoginWeb: true,
      currentPlan: {
        planId: '623040',
      },
      enableMyVoyage: 'N',
      isHealthOnly: false,
      myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
      firstTimeLogin: false,
      enableBST: 'Y',
      enableTPA: 'N',
      enableCoverages: false,
    };
    eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
      'eventTracking',
      'getSubscriberKey',
    ]);
    pushNotificationsServiceSpy = jasmine.createSpyObj(
      'PushNotificationsService',
      ['setContactKey']
    );
    qualtricsServiceSpy = jasmine.createSpyObj('QualtricsService', [
      'setUserProperties',
    ]);
    accountServiceSpy = jasmine.createSpyObj('AccountService', [
      'getParticipant',
    ]);
    googleAnalyticsServiceSpy = jasmine.createSpyObj('GoogleAnalyticsService', [
      'getQualtricsUser',
    ]);
    settingsServiceSpy = jasmine.createSpyObj('NotificationsSettingService', [
      'getNotificationSettings',
    ]);
    accessServiceSpy = jasmine.createSpyObj('AccessService', [
      'checkMyvoyageAccess',
      'checkLastPreferenceUpdated',
    ]);
    utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
      'getIsWeb',
      'setSuppressHeaderFooter',
      'registerModal',
    ]);
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
    modalPresentationServiceSpy = jasmine.createSpyObj(
      'ModalPresentationService',
      ['present']
    );
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        {
          provide: PushNotificationsService,
          useValue: pushNotificationsServiceSpy,
        },
        {provide: QualtricsService, useValue: qualtricsServiceSpy},
        {provide: AccountService, useValue: accountServiceSpy},
        {provide: GoogleAnalyticsService, useValue: googleAnalyticsServiceSpy},
        {provide: NotificationsSettingService, useValue: settingsServiceSpy},
        {provide: ModalController, useValue: modalControllerSpy},
        {provide: AccessService, useValue: accessServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {
          provide: ModalPresentationService,
          useValue: modalPresentationServiceSpy,
        },
      ],
    }).compileComponents();
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackHomeEvent', () => {
    it('should call eventTracking', () => {
      service['trackHomeEvent']();
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: service.eventContent.eventTrackingLogin.eventName,
      });
    });
  });

  describe('setSFMCContactKey', () => {
    it('should get the subscriber key and set the contact key if it has not already been set', async () => {
      service['contactKeySet'] = false;
      const subscriberKey = {subscriberKey: 'subscriberKey'};
      eventTrackingServiceSpy.getSubscriberKey.and.returnValue(subscriberKey);
      await service['setSFMCContactKey']();
      expect(service['contactKeySet']).toBeTrue();
      expect(eventTrackingServiceSpy.getSubscriberKey).toHaveBeenCalled();
      expect(pushNotificationsServiceSpy.setContactKey).toHaveBeenCalledWith(
        subscriberKey.subscriberKey
      );
    });

    it('should not get the subscriber key or set the contact key if it has already been set', async () => {
      service['contactKeySet'] = true;
      await service['setSFMCContactKey']();
      expect(eventTrackingServiceSpy.getSubscriberKey).not.toHaveBeenCalled();
      expect(pushNotificationsServiceSpy.setContactKey).not.toHaveBeenCalled();
    });
  });

  describe('setQualtricsProps', () => {
    it('should call qualtricsService setUserProperties', () => {
      const participant: Participant = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        profileId: 'profileId',
      } as Participant;
      accountServiceSpy.getParticipant.and.returnValue(of(participant));

      service['setQualtricsProps']();
      expect(qualtricsServiceSpy.setUserProperties).toHaveBeenCalledWith(
        participant
      );
    });
  });

  describe('getPartyId', () => {
    it('should return the partyid from getQualtricsUser', async () => {
      const partyId = 'abcdefghijklmnopqrstuvwxyz';
      googleAnalyticsServiceSpy.getQualtricsUser.and.returnValue(
        Promise.resolve({
          partyId: partyId,
        })
      );
      const result = await service.getPartyId();
      expect(result).toEqual(partyId);
      expect(googleAnalyticsServiceSpy.getQualtricsUser).toHaveBeenCalled();
    });

    it('should return undefined if null returned', async () => {
      googleAnalyticsServiceSpy.getQualtricsUser.and.returnValue(
        Promise.resolve(null)
      );
      const result = await service.getPartyId();
      expect(result).toBeUndefined();
    });
  });

  describe('getEmail', () => {
    it('should return the email from settingService', async () => {
      const email = '123@abc.com';
      settingsServiceSpy.getNotificationSettings.and.returnValue(
        of({primaryEmail: {email: email}})
      );
      const result = await service.getEmail();
      expect(result).toEqual(email);
      expect(settingsServiceSpy.getNotificationSettings).toHaveBeenCalled();
    });

    it('should return undefined if null returned', async () => {
      settingsServiceSpy.getNotificationSettings.and.returnValue(of(null));
      const result = await service.getEmail();
      expect(result).toBeUndefined();
    });

    it('should return undefined if no primaryemail returned', async () => {
      settingsServiceSpy.getNotificationSettings.and.returnValue(of({}));
      const result = await service.getEmail();
      expect(result).toBeUndefined();
    });
  });

  describe('initializeAppForUser', () => {
    it('should call setSFMCContactKey, setQualtricsProps and trackHomeEvent', () => {
      service['setSFMCContactKey'] = jasmine.createSpy();
      service['setQualtricsProps'] = jasmine.createSpy();
      service['trackHomeEvent'] = jasmine.createSpy();
      service.initializeAppForUser();
      expect(service['setSFMCContactKey']).toHaveBeenCalled();
      expect(service['setQualtricsProps']).toHaveBeenCalled();
      expect(service['trackHomeEvent']).toHaveBeenCalled();
    });
  });

  describe('openPreferenceSettingModal', () => {
    let modal;
    let preferenceResponse: SettingsPreferences;
    let getStayUpToDateSeenSpy;
    let modalProps;

    beforeEach(() => {
      modal = jasmine.createSpyObj('Modal', ['']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      preferenceResponse = {
        lastPreferenceResponse: true,
        required: true,
        primaryEmail: {
          lastUpdatedDate: new Date(),
          partyContactId: '987',
          email: 'jeni.anna@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: '70720357-e465-450a-a658-e9a1025913d6',
        mobilePhone: {
          lastUpdatedDate: new Date(),
          partyContactId: '123',
          phoneNumber: '1111111111',
        },
      };
      accessServiceSpy.checkLastPreferenceUpdated.and.returnValue(
        Promise.resolve(preferenceResponse)
      );
      getStayUpToDateSeenSpy = jasmine.createSpy().and.returnValue(false);
      service['getStayUpToDateSeen'] = getStayUpToDateSeenSpy;
      service['setStayUpToDateSeen'] = jasmine.createSpy();
      modalProps = {
        component: PreferenceSelectionPage,
        componentProps: {
          preferenceObject: preferenceResponse,
          loginObject: mockAccessData,
        },
        cssClass: 'modal-fullscreen',
      };
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
    });
    it('should not check whether to display the modal if myVoyage is not enabled', async () => {
      getStayUpToDateSeenSpy.and.returnValue(true);
      mockAccessData.enableMyVoyage = 'N';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(service['setStayUpToDateSeen']).not.toHaveBeenCalled();
      expect(
        accessServiceSpy.checkLastPreferenceUpdated
      ).not.toHaveBeenCalled();
    });
    it('should not check whether to display the modal if its already been seen', async () => {
      getStayUpToDateSeenSpy.and.returnValue(true);
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(service['setStayUpToDateSeen']).not.toHaveBeenCalled();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(
        accessServiceSpy.checkLastPreferenceUpdated
      ).not.toHaveBeenCalled();
    });

    it('should set modal seen and check whether to display the modal if it has not already been seen', async () => {
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(service['setStayUpToDateSeen']).toHaveBeenCalledWith(true);
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(accessServiceSpy.checkLastPreferenceUpdated).toHaveBeenCalled();
    });

    it('should present modal if its first time for web and mobile', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = true;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(modalControllerSpy.create).toHaveBeenCalledWith(modalProps);
      expect(modalPresentationServiceSpy.present).toHaveBeenCalledWith(modal);
    });

    it('should not present modal if its not first time for web or mobile and it has not been 6 months', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = false;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web or mobile and it has been 6 months but insights is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.insightsNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web or mobile and it has been 6 months but highPrioitytNotificationPrefs is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.highPrioitytNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web or mobile and it has been 6 months but accountAlertPrefs is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.accountAlertPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should present modal if its not first time for web or mobile but it has been 6 months and no pref is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      modalProps.cssClass = 'modal-scroll-fullscreen';
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith(modalProps);
    });

    it('should not present modal if its not first time for web and it has not been 6 months', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = false;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web and it has been 6 months but insights is on', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.insightsNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web and it has been 6 months but highPrioitytNotificationPrefs is on', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.highPrioitytNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for web and it has been 6 months but accountAlertPrefs is on', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.accountAlertPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should present modal if its not first time for web but it has been 6 months and no pref is on', async () => {
      mockAccessData.firstTimeLogin = true;
      mockAccessData.firstTimeLoginWeb = false;
      preferenceResponse.lastPreferenceResponse = true;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith(modalProps);
    });

    it('should not present modal if its not first time for mobile and it has not been 6 months', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = true;
      preferenceResponse.lastPreferenceResponse = false;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for mobile and it has been 6 months but insights is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = true;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.insightsNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for mobile and it has been 6 months but highPrioitytNotificationPrefs is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = true;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.highPrioitytNotificationPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should not present modal if its not first time for mobile and it has been 6 months but accountAlertPrefs is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = true;
      preferenceResponse.lastPreferenceResponse = true;
      preferenceResponse.accountAlertPrefs = {};
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });

    it('should present modal if its not first time for mobile but it has been 6 months and no pref is on', async () => {
      mockAccessData.firstTimeLogin = false;
      mockAccessData.firstTimeLoginWeb = true;
      preferenceResponse.lastPreferenceResponse = true;
      mockAccessData.enableMyVoyage = 'Y';
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(mockAccessData);
      await service.openPreferenceSettingModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith(modalProps);
    });
  });

  describe('setStayUpToDateSeen', () => {
    it('should set the prop and local storage', () => {
      service['stayUpToDateSeen'] = undefined;
      spyOn(Storage.prototype, 'setItem');
      service['setStayUpToDateSeen'](true);
      expect(service['stayUpToDateSeen']).toBeTrue();
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'stayUpToDateSeen',
        'true'
      );
    });
  });

  describe('getStayUpToDateSeen', () => {
    let storageSpy;
    beforeEach(() => {
      service['stayUpToDateSeen'] = undefined;
      storageSpy = spyOn(Storage.prototype, 'getItem');
    });

    it('should return the prop if its already set', () => {
      service['stayUpToDateSeen'] = true;
      const result = service['getStayUpToDateSeen']();
      expect(Storage.prototype.getItem).not.toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return the value from local storage if its not set and it exists in localStorage', () => {
      storageSpy.and.returnValue('true');
      const result = service['getStayUpToDateSeen']();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'stayUpToDateSeen'
      );
      expect(result).toBeTrue();
    });

    it('should return false if its not set and it does not exist in localStorage', () => {
      const result = service['getStayUpToDateSeen']();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'stayUpToDateSeen'
      );
      expect(result).toBeFalse();
    });
  });
});
