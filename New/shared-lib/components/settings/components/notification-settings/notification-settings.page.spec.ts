import {SettingsContent} from '@shared-lib/services/notification-setting/models/notification-settings-content.model';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, LoadingController} from '@ionic/angular';
import {NotificationSettingsPage} from './notification-settings.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';

describe('NotificationSettingsPage', () => {
  let component: NotificationSettingsPage;
  let fixture: ComponentFixture<NotificationSettingsPage>;
  let headerFooterTypeServiceSpy;
  let settingsServiceSpy;
  let loadingControllerSpy;
  let settingsContent: SettingsContent;
  let initSpy;
  let platformServiceSpy;
  let utilityServiceSpy;
  let journeyServiceSpy;
  let eventTrackingServiceSpy;
  let trackNotificationPreferenceUpdateSpy;
  let undoSettingsSpy;

  beforeEach(
    waitForAsync(() => {
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      headerFooterTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('NotificationsSettingService', [
        'getSettingsContent',
        'getNotificationSettings',
        'setPrefsSettings',
        'saveNotificationPrefs',
      ]);
      loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
        'create',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getJourneyBackButton',
        'setJourneyBackButton',
      ]);
      eventTrackingServiceSpy = jasmine.createSpyObj('EventTrackingService', [
        'eventTracking',
      ]);

      TestBed.configureTestingModule({
        declarations: [NotificationSettingsPage],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
          {provide: NotificationsSettingService, useValue: settingsServiceSpy},
          {provide: LoadingController, useValue: loadingControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: EventTrackingService, useValue: eventTrackingServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationSettingsPage);
      component = fixture.componentInstance;

      initSpy = spyOn(component, 'initData');
      undoSettingsSpy = spyOn(component, 'undoSettings');
      trackNotificationPreferenceUpdateSpy = spyOn(
        component,
        'trackNotificationPreferenceUpdate'
      );
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadData', () => {
      expect(component.initData).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header values with journey back button if defined', () => {
      journeyServiceSpy.getJourneyBackButton.and.returnValue('settings');
      component.actionOption.buttonLeft.link = undefined;
      component.savePath = undefined;
      component.ionViewWillEnter();
      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: component.actionOption,
        },
        {type: FooterType.tabsnav, selectedTab: 'settings'}
      );
      expect(journeyServiceSpy.setJourneyBackButton).toHaveBeenCalledWith(
        undefined
      );
      expect(component.actionOption.buttonLeft.link).toEqual('settings');
      expect(component.savePath).toEqual('settings');
    });

    it('should set actionOption back button and savePath back to the default if journey link is not defined', () => {
      journeyServiceSpy.getJourneyBackButton.and.returnValue(undefined);
      const link = 'more';
      component.actionOption.buttonLeft.link = link;
      component.savePath = link;
      component.ionViewWillEnter();
      expect(component.actionOption.buttonLeft.link).toEqual('settings');
      expect(component.savePath).toEqual('/settings');
    });
  });

  describe('initData', () => {
    beforeEach(() => {
      initSpy.and.callThrough();

      settingsServiceSpy.getSettingsContent.and.returnValue(
        Promise.resolve(settingsContent)
      );
    });

    it('should get settings and content', async () => {
      await component.initData();
      expect(settingsServiceSpy.getSettingsContent).toHaveBeenCalled();
      expect(settingsServiceSpy.setPrefsSettings).toHaveBeenCalled();
    });
  });

  describe('saveSettings', () => {
    let loadSpy;
    beforeEach(() => {
      spyOn(Router.prototype, 'navigateByUrl');
      loadSpy = jasmine.createSpyObj('Loader', ['present', 'dismiss']);
      loadingControllerSpy.create.and.returnValue(Promise.resolve(loadSpy));
    });
    it('should save the settings and route to savePath if isWeb is false', async () => {
      component.isWeb = false;
      const savePath = 'savePath';
      component.savePath = savePath;
      await component.saveSettings();

      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(loadSpy.present).toHaveBeenCalled();
      expect(settingsServiceSpy.saveNotificationPrefs).toHaveBeenCalled();
      expect(trackNotificationPreferenceUpdateSpy).toHaveBeenCalled();
      expect(settingsServiceSpy.getNotificationSettings).toHaveBeenCalledWith(
        true
      );
      expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith(savePath);
      expect(loadSpy.present).toHaveBeenCalled();
    });
    it('should route to more if it is web and not desktop', async () => {
      component.isWeb = true;
      component.isDesktop = false;
      await component.saveSettings();
      expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith('more');
    });
  });

  describe('trackNotificationPreferenceUpdate', () => {
    beforeEach(() => {
      trackNotificationPreferenceUpdateSpy.and.callThrough();
    });
    it('should call eventTracking', () => {
      component.trackNotificationPreferenceUpdate();
      expect(eventTrackingServiceSpy.eventTracking).toHaveBeenCalledWith({
        eventName: component.eventContent.eventTrackingPreference.eventName,
      });
    });
  });

  describe('undoSettings', () => {
    beforeEach(() => {
      component['savePath'] = '/settings';
      settingsServiceSpy['prefSettingsInitialized'] = false;
      undoSettingsSpy.and.callThrough();
      settingsServiceSpy.setPrefsSettings = jasmine.createSpy();
      spyOn(Router.prototype, 'navigateByUrl');
    });
    it('should undo the settings and route to savePath', () => {
      component.undoSettings();
      expect(settingsServiceSpy.setPrefsSettings).toHaveBeenCalled();
      expect(Router.prototype.navigateByUrl).toHaveBeenCalledWith(
        component['savePath']
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
