import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {endpoints} from './constants/endpoints/endpoints';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {CommonModule} from '@angular/common';
import {NotificationsSettingService} from './notification-setting.service';
import {SettingsPreferences} from './models/notification-settings-preferences.model';
import {PartyIds} from './models/party-ids.model';
import * as settingsContent from './constants/notification-settings-more.json';
import {of} from 'rxjs';

describe('NotificationsSettingService', () => {
  let settingsService: NotificationsSettingService;
  let settingsServiceSpy;
  let partyIdVals: PartyIds;
  let settingsPrefs: SettingsPreferences;
  let baseServiceSpy;
  let routerSpy;
  let utilityServiceSpy;
  let settingsResponse;
  let sampleDate: Date;
  let observableSpy;
  const testPartyId = '394fab41-6658-4164-9872-606ab1660bfb';

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpyObj('BaseService', [
      'get',
      'push',
      'post',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'appendBaseUrlToEndpoints',
    ]);
    settingsServiceSpy = jasmine.createSpyObj('NotificationsSettingService', [
      'updateSettings',
      'getPrefSettings',
      'setNotificationPrefs',
    ]);

    sampleDate = new Date('2021-11-15T12:57:58');
    partyIdVals = {
      emailContactId: '1111',
      mobileContactId: '1111',
      HPPrefPushContactId: '1111',
      HPPrefMobileContactId: '1111',
      HPPrefEmailContactId: '1111',
      AAPrefPushContactId: '1111',
      AAPrefMobileContactId: '1111',
      AAPrefEmailContactId: '1111',
      INPrefPushContactId: '1111',
      INPrefMobileContactId: '1111',
      INPrefEmailContactId: '1111',
    };
    settingsPrefs = {
      required: false,
      primaryEmail: {
        lastUpdatedDate: sampleDate,
        partyContactId: testPartyId,
        email: 'test@voya.com',
        lastFailedInd: 'N',
      },
      secondaryEmailAllowed: false,
      docDeliveryEmailContactId: testPartyId,
      mobilePhone: {
        lastUpdatedDate: sampleDate,
        partyContactId: testPartyId,
        phoneNumber: testPartyId,
      },
      insightsNotificationPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
      highPrioitytNotificationPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
      accountAlertPrefs: {
        prefPushNotificationContactId: testPartyId,
        prefMobileContactId: testPartyId,
        prefEmailContactId: testPartyId,
      },
    };

    settingsResponse = (settingsContent as any).default;
    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endpoints);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CommonModule],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();
    settingsService = TestBed.inject(NotificationsSettingService);

    jasmine.clock().install();
    const baseTime = new Date(2013, 9, 23);
    jasmine.clock().mockDate(baseTime);

    observableSpy = jasmine.createSpyObj('Observable', ['next']);
    settingsService['notificationPrefsChanged'] = observableSpy;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(settingsService).toBeTruthy();
  });

  describe('constructor', () => {
    it('should append the base url to the endpoints', () => {
      expect(utilityServiceSpy.appendBaseUrlToEndpoints).toHaveBeenCalledWith(
        endpoints
      );
    });
  });

  describe('getSettingsContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsResponse));
    });

    it('should return the settings content after calling base service on first call', async () => {
      const result = await settingsService.getSettingsContent();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endpoints.getFooterContent
      );
      expect(result).toEqual(settingsResponse);
    });

    it('should return the settings content without calling baseService again if it is not null', async () => {
      await settingsService.getSettingsContent();
      await settingsService.getSettingsContent();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('setNotificationSettings', () => {
    it('should call notificationSettingsSubject.next', () => {
      const spy = jasmine.createSpyObj('Subject', ['next']);
      settingsService['notificationSettingsSubject'] = spy;
      settingsService.setNotificationSettings(settingsPrefs);
      expect(spy.next).toHaveBeenCalledWith(settingsPrefs);
    });
  });

  describe('getNotificationSettings', () => {
    beforeEach(() => {
      settingsPrefs = {
        required: false,
        primaryEmail: {
          lastUpdatedDate: new Date(),
          partyContactId: testPartyId,
          email: 'test@voya.com',
          lastFailedInd: 'N',
        },
        secondaryEmailAllowed: false,
        docDeliveryEmailContactId: testPartyId,
        mobilePhone: {
          lastUpdatedDate: new Date(),
          partyContactId: testPartyId,
          phoneNumber: '1112223333',
        },
        insightsNotificationPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: testPartyId,
          prefMobileContactId: testPartyId,
          prefEmailContactId: testPartyId,
        },
      };
    });

    it('get notification settings', done => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsPrefs));
      settingsService.getNotificationSettings().subscribe(result => {
        expect(result).toEqual(settingsPrefs);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/notificationPreferences'
        );
        done();
      });
    });

    it('should return notification settings and have set mobilePhone to defaults if it is undefined', done => {
      settingsPrefs.mobilePhone = undefined;
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsPrefs));

      settingsService.getNotificationSettings().subscribe(result => {
        const newSettings = {...settingsPrefs};
        newSettings.mobilePhone = {
          partyContactId: '',
          phoneNumber: '',
          lastUpdatedDate: new Date(),
        };

        expect(result).toEqual(newSettings);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/notificationPreferences'
        );
        done();
      });
    });

    it('should notification settings and force refresh it', async () => {
      baseServiceSpy.get.calls.reset();
      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsPrefs));

      settingsService.getNotificationSettings().subscribe(data => {
        expect(data).toEqual(settingsPrefs);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/notificationPreferences'
        );
      });

      baseServiceSpy.get.and.returnValue(Promise.resolve(settingsPrefs));

      settingsService.getNotificationSettings(true).subscribe(data => {
        expect(data).toEqual(settingsPrefs);
        expect(baseServiceSpy.get).toHaveBeenCalledWith(
          'myvoyage/ws/ers/service/notificationPreferences'
        );
        expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('updateSettings', () => {
    it('should update setting based on checked = true', () => {
      settingsService.prefSettings.emailContactId = testPartyId;

      settingsService.prefSettings.HPPrefEmailContactId = 'DONT_EMAIL';
      settingsService.updateSettings(true, 'HPPrefEmailContactId-DONT_EMAIL');

      expect(settingsService.prefSettings.HPPrefEmailContactId).toEqual(
        testPartyId
      );
      expect(observableSpy.next).toHaveBeenCalled();
    });

    it('should update setting based on checked = true and set val to phone party id', () => {
      settingsService.prefSettings.mobileContactId = 'aaa-bbb-ccc-ddd-111';

      settingsService.prefSettings.HPPrefMobileContactId = 'DONT_TEXT';
      settingsService.updateSettings(true, 'HPPrefMobileContactId-DONT_TEXT');

      expect(settingsService.prefSettings.HPPrefMobileContactId).toEqual(
        'aaa-bbb-ccc-ddd-111'
      );
      expect(observableSpy.next).toHaveBeenCalled();
    });

    it('should update setting based on checked = true and set push val to email party id', () => {
      settingsService.prefSettings.emailContactId = testPartyId;

      settingsService.prefSettings.HPPrefPushContactId = 'DONT_PUSH';
      settingsService.updateSettings(true, 'HPPrefPushContactId-DONT_PUSH');

      expect(settingsService.prefSettings.HPPrefPushContactId).toEqual(
        testPartyId
      );
      expect(observableSpy.next).toHaveBeenCalled();
    });

    it('should update setting based on checkbox value if not checked', () => {
      settingsService.prefSettings.HPPrefEmailContactId = testPartyId;
      settingsService.updateSettings(false, 'HPPrefEmailContactId-DONT_EMAIL');

      expect(settingsService.prefSettings.HPPrefEmailContactId).toEqual(
        'DONT_EMAIL'
      );
      expect(observableSpy.next).toHaveBeenCalled();
    });
  });

  describe('setPrefsSettings', () => {
    let getNotificationSettingsSpy;
    let nullPartyIds;

    beforeEach(() => {
      getNotificationSettingsSpy = spyOn(
        settingsService,
        'getNotificationSettings'
      ).and.returnValue(of(settingsPrefs));
      settingsService.prefSettings = undefined;
      nullPartyIds = {
        emailContactId: undefined,
        mobileContactId: undefined,
        HPPrefPushContactId: undefined,
        HPPrefMobileContactId: undefined,
        HPPrefEmailContactId: undefined,
        AAPrefPushContactId: undefined,
        AAPrefMobileContactId: undefined,
        AAPrefEmailContactId: undefined,
        INPrefPushContactId: undefined,
        INPrefMobileContactId: undefined,
        INPrefEmailContactId: undefined,
      };
    });

    it('should not call getNotificationSettings if the prefs have already been initialized', () => {
      settingsService['prefSettingsInitialized'] = true;
      settingsService.setPrefsSettings();
      expect(settingsService.getNotificationSettings).not.toHaveBeenCalled();
    });

    it('should set values to undefined if settingsPrefs are undefined', () => {
      getNotificationSettingsSpy.and.returnValue(
        of({
          required: false,
          primaryEmail: {
            lastUpdatedDate: sampleDate,
            partyContactId: undefined,
            email: 'test@voya.com',
            lastFailedInd: 'N',
          },
          secondaryEmailAllowed: false,
          docDeliveryEmailContactId: testPartyId,
          mobilePhone: {
            partyContactId: undefined,
            phoneNumber: undefined,
            lastUpdatedDate: sampleDate,
          },
          insightsNotificationPrefs: {
            prefPushNotificationContactId: undefined,
            prefMobileContactId: undefined,
            prefEmailContactId: undefined,
          },
          highPrioitytNotificationPrefs: {
            prefPushNotificationContactId: undefined,
            prefMobileContactId: undefined,
            prefEmailContactId: undefined,
          },
          accountAlertPrefs: {
            prefPushNotificationContactId: undefined,
            prefMobileContactId: undefined,
            prefEmailContactId: undefined,
          },
        })
      );
      settingsService.setPrefsSettings();
      expect(settingsService.getNotificationSettings).toHaveBeenCalled();
      expect(settingsService.prefSettings).toEqual(nullPartyIds);
      expect(
        settingsService['notificationPrefsChanged'].next
      ).toHaveBeenCalledWith(nullPartyIds);
    });

    it('should set values to undefined if props under settingsPrefs are undefined', () => {
      getNotificationSettingsSpy.and.returnValue(
        of({
          required: false,
          primaryEmail: undefined,
          secondaryEmailAllowed: false,
          docDeliveryEmailContactId: undefined,
          mobilePhone: undefined,
          insightsNotificationPrefs: undefined,
          highPrioitytNotificationPrefs: undefined,
          accountAlertPrefs: undefined,
        })
      );

      settingsService.setPrefsSettings();
      expect(settingsService.prefSettings).toEqual(nullPartyIds);
      expect(
        settingsService['notificationPrefsChanged'].next
      ).toHaveBeenCalledWith(nullPartyIds);
    });

    it('should set prefSettings and call next', () => {
      const fakePartyIds = {
        emailContactId: testPartyId,
        mobileContactId: testPartyId,
        HPPrefPushContactId: testPartyId,
        HPPrefMobileContactId: testPartyId,
        HPPrefEmailContactId: testPartyId,
        AAPrefPushContactId: testPartyId,
        AAPrefMobileContactId: testPartyId,
        AAPrefEmailContactId: testPartyId,
        INPrefPushContactId: testPartyId,
        INPrefMobileContactId: testPartyId,
        INPrefEmailContactId: testPartyId,
      };
      settingsService.setPrefsSettings();
      expect(settingsService.prefSettings).toEqual(fakePartyIds);
      expect(
        settingsService['notificationPrefsChanged'].next
      ).toHaveBeenCalledWith(fakePartyIds);
    });
  });

  describe('saveNotificationPrefs', async () => {
    beforeEach(() => {
      settingsServiceSpy.getPrefSettings.and.returnValue(partyIdVals);
    });
    it('should save preferences', async () => {
      settingsService.prefSettings = partyIdVals;

      await settingsService.saveNotificationPrefs();
      expect(settingsService.updatedValues).toEqual({
        insightsNotificationPrefs: {
          prefPushNotificationContactId: '1111',
          prefMobileContactId: '1111',
          prefEmailContactId: '1111',
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: '1111',
          prefMobileContactId: '1111',
          prefEmailContactId: '1111',
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: '1111',
          prefMobileContactId: '1111',
          prefEmailContactId: '1111',
        },
      });
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.saveNotificationPreferences,
        settingsService.updatedValues
      );
    });
    it('should use save preferences which is passed', async () => {
      settingsService.prefSettings = partyIdVals;
      const pref = {
        insightsNotificationPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '123',
          prefEmailContactId: '987',
        },
        accountAlertPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '123',
          prefEmailContactId: '987',
        },
        highPrioitytNotificationPrefs: {
          prefPushNotificationContactId: 'DONT_PUSH',
          prefMobileContactId: '123',
          prefEmailContactId: '987',
        },
      };
      await settingsService.saveNotificationPrefs(pref);
      expect(settingsService.updatedValues).toEqual(pref);
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        endpoints.saveNotificationPreferences,
        settingsService.updatedValues
      );
    });
  });

  describe('getCheckedAndActive', () => {
    it('should return check values based on partyIds and set to true if there is a partyId', () => {
      const result = settingsService.getCheckedAndActive(
        {
          emailContactId: '1111',
          mobileContactId: '1111',
          HPPrefPushContactId: '1111',
          HPPrefMobileContactId: '1111',
          HPPrefEmailContactId: '1111',
          AAPrefPushContactId: '1111',
          AAPrefMobileContactId: '1111',
          AAPrefEmailContactId: '1111',
          INPrefPushContactId: '1111',
          INPrefMobileContactId: '1111',
          INPrefEmailContactId: '1111',
        },
        'HPPref'
      );
      expect(result.textChecked).toBeTrue();
      expect(result.pushChecked).toBeTrue();
      expect(result.emailChecked).toBeTrue();
      expect(result.sectionActive).toBeTrue();
    });
    it('should return check values and set false for undefined', () => {
      const result = settingsService.getCheckedAndActive(
        {
          HPPrefPushContactId: undefined,
          HPPrefMobileContactId: undefined,
          HPPrefEmailContactId: undefined,
        },
        'HPPref'
      );
      expect(result.textChecked).toBeFalse();
      expect(result.pushChecked).toBeFalse();
      expect(result.emailChecked).toBeFalse();
      expect(result.sectionActive).toBeFalse();
      expect(result.textDisabled).toBeTrue();
    });
    it('should return the checks to false if the val is DONT', () => {
      const result = settingsService.getCheckedAndActive(
        {
          HPPrefPushContactId: 'DONT_PUSH',
          HPPrefMobileContactId: 'DONT_TEXT',
          HPPrefEmailContactId: 'DONT_EMAIL',
        },
        'HPPref'
      );
      expect(result.textChecked).toBeFalse();
      expect(result.pushChecked).toBeFalse();
      expect(result.emailChecked).toBeFalse();
      expect(result.sectionActive).toBeFalse();
    });
    it('should return section active if any are true', () => {
      const result = settingsService.getCheckedAndActive(
        {
          HPPrefPushContactId: undefined,
          HPPrefMobileContactId: undefined,
          HPPrefEmailContactId: '11123-333',
        },
        'HPPref'
      );
      expect(result.textChecked).toBeFalse();
      expect(result.pushChecked).toBeFalse();
      expect(result.emailChecked).toBeTrue();
      expect(result.sectionActive).toBeTrue();
    });
    it('should return text disabled true if mobilePhone Object is not present', () => {
      settingsService.prefSettings = {};
      const result = settingsService.getCheckedAndActive(
        {
          HPPrefPushContactId: undefined,
          HPPrefMobileContactId: undefined,
          HPPrefEmailContactId: '11123-333',
        },
        'HPPref'
      );
      expect(result.textDisabled).toBeFalse();
    });
  });
});
