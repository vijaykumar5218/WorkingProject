import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {SettingsPreferences} from '@shared-lib/services/notification-setting/models/notification-settings-preferences.model';
import {AccountInfoPage} from './account-info.page';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('AccountInfoPage', () => {
  let component: AccountInfoPage;
  let settingsPrefs: SettingsPreferences;
  let fixture: ComponentFixture<AccountInfoPage>;
  let sampleDate: Date;
  const testPartyId = '394fab41-6658-4164-9872-606ab1660bfb';
  let accountInfoServiceSpy;
  let notificationServiceSpy;
  let accountServiceSpy;
  let fetchSpy;
  let fetchPrefsSpy;
  let utilityServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoServiceSpy', [
        'getAccountRecovery',
        'getPassword',
        'formatPhoneNumber',
      ]);
      notificationServiceSpy = jasmine.createSpyObj('NotifictionServiceSpy', [
        'getNotificationSettings',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountServiceSpy', [
        'getParticipant',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true} as AccessResult)
      );

      sampleDate = new Date('2021-11-15T12:57:58');
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

      TestBed.configureTestingModule({
        declarations: [AccountInfoPage],
        imports: [HttpClientModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},

          {
            provide: NotificationsSettingService,
            useValue: notificationServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountInfoPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchData');
      fetchPrefsSpy = spyOn(component, 'getPrefs');
      fixture.detectChanges();
      component.participantDataSubscription = jasmine.createSpyObj(
        'Subscription',
        ['unsubscribe']
      );
      component.settingsPrefSubscription = jasmine.createSpyObj(
        'Subscription',
        ['unsubscribe']
      );
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchData and getIsWeb', () => {
      component.ngOnInit();
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('should call getPrefs', () => {
      expect(component.getPrefs).toHaveBeenCalled();
    });
    it('should call accessService and get isHealthOnly', () => {
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isHealthOnly).toBeTrue();
    });
  });

  describe('fetchData', async () => {
    let participantData;
    beforeEach(() => {
      fetchSpy.and.callThrough();
      participantData = {
        firstName: 'Jae',
        lastName: 'Kin',
        displayName: 'D',
        age: '68',
        birthDate: '03/26/1993',
        profileId: 'sdasd-sdasd-fdgdg-sdfsfs',
      };

      accountServiceSpy.getParticipant.and.returnValue(of(participantData));
    });

    it('should call getparticipant from accountservice and return participant data', () => {
      component.fetchData();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(component.participantData).toEqual(participantData);
    });
  });

  describe('getPrefs', async () => {
    beforeEach(() => {
      fetchPrefsSpy.and.callThrough();
      component.emailError = undefined;

      accountInfoServiceSpy.formatPhoneNumber.and.returnValue('111-222-3333');
    });
    it('hould set email and phone and should set emailError to false if lastFailedInd = N and set loading to false', async () => {
      notificationServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefs)
      );
      await component.getPrefs();
      expect(component.email).toEqual('test@voya.com');
      expect(accountInfoServiceSpy.formatPhoneNumber).toHaveBeenCalledWith(
        '1112223333'
      );
      expect(component.phone).toEqual('111-222-3333');
      expect(component.emailError).toBeFalse();
      expect(component.loading).toBeFalse();
    });
    it('should set emailError to true if lastFailedInd = Y', async () => {
      (settingsPrefs.primaryEmail.lastFailedInd = 'Y'),
        notificationServiceSpy.getNotificationSettings.and.returnValue(
          of(settingsPrefs)
        );
      await component.getPrefs();

      expect(component.emailError).toBeTrue();
    });
    it('should set emailError to false if primaryEmail == null', async () => {
      settingsPrefs.primaryEmail == null;

      notificationServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefs)
      );
      await component.getPrefs();

      expect(component.emailError).toBeFalse();
    });
    it('should set emailError to true if primaryEmail is undefined', async () => {
      settingsPrefs == null;
      const settingsPrefsNull = {
        required: false,
        mobilePhone: {
          astUpdatedDate: '2022-07-25T05:34:16',
          partyContactId: '5a5914af-6369-4317-86d9-44e0ae9816e2',
          phoneNumber: '5233587415',
        },
        secondaryEmailAllowed: false,
      };

      notificationServiceSpy.getNotificationSettings.and.returnValue(
        of(settingsPrefsNull)
      );
      await component.getPrefs();
      expect(component.email).not.toEqual('test@gmail.com');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(
        component.participantDataSubscription.unsubscribe
      ).toHaveBeenCalled();
      expect(component.settingsPrefSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
