import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SettingsPage} from './settings.page';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {of} from 'rxjs';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let headerTypeServiceSpy;
  let notificationsSettingServiceSpy;
  let settingsPrefs;
  let testPartyId;
  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      notificationsSettingServiceSpy = jasmine.createSpyObj(
        'notificationsSettingServiceSpy',
        ['getNotificationSettings']
      );
      testPartyId = 'aaa-bbb-cccv';
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
      notificationsSettingServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefs)
      );
      TestBed.configureTestingModule({
        declarations: [SettingsPage],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {
            provide: NotificationsSettingService,
            useValue: notificationsSettingServiceSpy,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(SettingsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      notificationsSettingServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefs)
      );
    });

    it('should call getNotificationSettings from notificationsSettingService', async () => {
      component.ngOnInit();
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        null
      );
      expect(
        notificationsSettingServiceSpy.getNotificationSettings
      ).toHaveBeenCalled();
      expect(component.settings).toEqual(settingsPrefs);
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
