import {TestBed, waitForAsync} from '@angular/core/testing';
import {LandingService} from './landing.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from '../constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {
  AllLaunchContent,
  LaunchContent,
  NoAccessMessage,
  VersionAlertContent,
} from '../models/landing.model';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {AccessService} from '../../../../../../../shared-lib/services/access/access.service';
import {AttestationService} from '@mobile/app/modules/shared/service/attestation/attestation.service';
import {AlertWindowService} from '@mobile/app/modules/shared/service/alert-window/alert-window.service';
import {of, Subscription} from 'rxjs';
import {PlatformService} from '@mobile/app/modules/shared/service/platform/platform.service';
import {version} from '../constants/version';

describe('LandingService', () => {
  let service: LandingService;
  let baseServiceSpy;
  let utilityServiceSpy;
  let inAppBrowserSpy;
  let allLaunchContent: AllLaunchContent;
  let launchContent: LaunchContent;
  let noAccessMessage: NoAccessMessage;
  let appVersionJSON: VersionAlertContent;
  let accessServiceSpy;
  let attestServiceSpy;
  let alertWindowServiceSpy;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', [
        'get',
        'navigateByUrl',
      ]);
      inAppBrowserSpy = jasmine.createSpyObj('InAppBrowser', [
        'openInAppBrowser',
      ]);
      attestServiceSpy = jasmine.createSpyObj('AttestationService', [
        'attestApplication',
      ]);
      alertWindowServiceSpy = jasmine.createSpyObj('AlertWindowService', [
        'presentAlert',
      ]);
      platformServiceSpy = jasmine.createSpyObj('Platform', ['isIos']);

      launchContent = {
        MobileLaunchContent: [
          {
            login_description: {
              description: 'desc',
              image_url: 'img',
              link_name: 'link',
              link_url: 'link',
            },
            login_section: 'login',
            login_title: 'title',
          },
        ],
      };

      noAccessMessage = {
        message_1: 'test1',
        message_2: 'test2',
      };

      appVersionJSON = {
        downloadText: 'Download',
        alertText:
          'You are using an older version of the app that is no longer supported. Please download the latest version.',
        iosAppUrl: 'https://apps.apple.com/us/app/myvoyage/id1594192157',
        androidAppUrl:
          'https://play.google.com/store/apps/details?id=com.voya.edt.myvoyage',
        minVersion: version + 1,
      };

      allLaunchContent = {
        LoginNoAccessMessage: JSON.stringify(noAccessMessage),
        loginJSON: JSON.stringify(launchContent),
        AppVersionJSON: JSON.stringify(appVersionJSON),
      };

      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          LandingService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: InAppBroserService, useValue: inAppBrowserSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: AttestationService, useValue: attestServiceSpy},
          {provide: AlertWindowService, useValue: alertWindowServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      });
      service = TestBed.inject(LandingService);
      service.endPoints = endPoints;
      service['resumeSubscription'] = jasmine.createSpyObj(
        'resumeSubscription',
        ['unsubscribe']
      );
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('navigateByUrl', () => {
    it('should call baseService navigateByUrl', () => {
      service.navigateByUrl('alink');
      expect(baseServiceSpy.navigateByUrl).toHaveBeenCalledWith('alink');
    });
  });

  describe('getAllLaunchContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(allLaunchContent));
    });

    it('should load orange money data', async () => {
      service['allLaunchContent'] = null;

      const result = await service.getAllLaunchContent();

      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/public/content/section/login',
        false
      );
      expect(result).toEqual(allLaunchContent);

      const result2 = await service.getAllLaunchContent();

      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result2).toEqual(allLaunchContent);
    });

    it('should load orange money data and force refresh it', async () => {
      service['allLaunchContent'] = null;

      const result = await service.getAllLaunchContent();

      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/public/content/section/login',
        false
      );
      expect(result).toEqual(allLaunchContent);

      const result2 = await service.getAllLaunchContent(true);

      expect(baseServiceSpy.get).toHaveBeenCalledTimes(2);
      expect(result2).toEqual(allLaunchContent);
    });
  });

  describe('getLandingContent', () => {
    it('should call getAllLaunchContent and return landing content', async () => {
      spyOn(service, 'getAllLaunchContent').and.returnValue(
        Promise.resolve(allLaunchContent)
      );

      const result = await service.getLandingContent();

      expect(service.getAllLaunchContent).toHaveBeenCalled();
      expect(result).toEqual(launchContent);
    });
  });

  describe('getNoAccessMessage', () => {
    it('should call getAllLaunchContent and return no access message', async () => {
      spyOn(service, 'getAllLaunchContent').and.returnValue(
        Promise.resolve(allLaunchContent)
      );

      const result = await service.getNoAccessMessage();

      expect(service.getAllLaunchContent).toHaveBeenCalled();
      expect(result).toEqual(noAccessMessage);
    });
  });

  describe('checkMyvoyageAccess', () => {
    it('should call accessService checkMyvoyageAccess', async () => {
      service.checkMyvoyageAccess();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalledWith(true);
    });
  });

  describe('openInBrowser', () => {
    it('should call in app browser open', () => {
      service.openInBrowser('http://www.google.com');
      expect(inAppBrowserSpy.openInAppBrowser).toHaveBeenCalledWith(
        'http://www.google.com',
        new VoyaIABController()
      );
    });
  });

  describe('validateApplication', () => {
    it('should call attestationService attestApplication', async () => {
      attestServiceSpy.attestApplication.and.returnValue(Promise.resolve(true));

      const result = await service.validateApplication();
      expect(attestServiceSpy.attestApplication).toHaveBeenCalled();
      expect(result).toBeTrue();
    });
  });

  describe('openVersionAlert', () => {
    let getAllLaunchContentSpy;
    beforeEach(() => {
      getAllLaunchContentSpy = spyOn(
        service,
        'getAllLaunchContent'
      ).and.returnValue(Promise.resolve(allLaunchContent));
      spyOn(window, 'open');
      platformServiceSpy.onResume$ = of();
    });

    it('should subscribe to resume to attempt to reopen if not already subscribed', async () => {
      spyOn(platformServiceSpy.onResume$, 'subscribe');
      service['resumeSubscription'] = undefined;
      await service.openVersionAlert();
      expect(platformServiceSpy.onResume$.subscribe).toHaveBeenCalledWith(
        jasmine.any(Function)
      );
      service['closed'] = true;
    });

    it('should not subscribe to resume to attempt to reopen if already subscribed', async () => {
      spyOn(platformServiceSpy.onResume$, 'subscribe');
      service['resumeSubscription'] = new Subscription();
      await service.openVersionAlert();
      expect(platformServiceSpy.onResume$.subscribe).not.toHaveBeenCalled();
    });

    it('should not open the alert if the version is equal to or greater than the min', async () => {
      appVersionJSON.minVersion = 1;
      allLaunchContent.AppVersionJSON = JSON.stringify(appVersionJSON);
      getAllLaunchContentSpy.and.returnValue(Promise.resolve(allLaunchContent));
      await service.openVersionAlert();
      expect(alertWindowServiceSpy.presentAlert).not.toHaveBeenCalled();
    });

    it('should open the alert with ios url if the version is less than the min and the platform is ios', async () => {
      platformServiceSpy.isIos.and.returnValue(true);
      await service.openVersionAlert();
      expect(alertWindowServiceSpy.presentAlert).toHaveBeenCalledWith({
        cssClass: 'version-alert',
        message: appVersionJSON.alertText,
        header: ' ',
        backdropDismiss: false,
        buttons: [
          {
            text: appVersionJSON.downloadText,
            handler: jasmine.any(Function),
          },
        ],
      });
      const handler = alertWindowServiceSpy.presentAlert.calls.all()[0].args[0]
        .buttons[0].handler;
      handler();
      expect(window.open).toHaveBeenCalledWith(appVersionJSON.iosAppUrl);
    });

    it('should open the alert with android url if the version is less than the min and the platform is not ios', async () => {
      platformServiceSpy.isIos.and.returnValue(false);

      await service.openVersionAlert();
      const handler = alertWindowServiceSpy.presentAlert.calls.all()[0].args[0]
        .buttons[0].handler;
      service['closed'] = false;
      handler();
      expect(window.open).toHaveBeenCalledWith(appVersionJSON.androidAppUrl);
      expect(service['closed']).toEqual(true);
    });

    it('should not open the alert with if the version is less than the min but the alert is already open', async () => {
      service['closed'] = false;

      await service.openVersionAlert();
      expect(alertWindowServiceSpy.presentAlert).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from resumeSubscription', () => {
      service.ngOnDestroy();
      expect(service['resumeSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
