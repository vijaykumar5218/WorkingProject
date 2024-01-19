import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {InAppBroserService} from './in-app-browser.service';
import {
  InAppBrowserObject,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser';
import {LoadingController} from '@ionic/angular';
import {IABController} from './controllers/iab-controller';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {PlatformService} from '../platform/platform.service';

describe('InAppBroserService', () => {
  let service: InAppBroserService;
  let baseServiceSpy;
  let cordovaInAppSpy;
  let platformServiceSpy;

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpy('BaseService');
    platformServiceSpy = jasmine.createSpyObj('Platform', [], {
      onResume$: of(jasmine.createSpyObj('OBJ', ['subscribe'])).pipe(delay(1)),
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: PlatformService, useValue: platformServiceSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(InAppBroserService);
    cordovaInAppSpy = jasmine.createSpyObj('cordovaInApp', ['open']);
    service['window'].cordova = {InAppBrowser: cordovaInAppSpy};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOptionsString', () => {
    it('should take InAppBrowserOptions object and return options string', () => {
      const inAppBrowserOpts: InAppBrowserOptions = {
        footer: 'no',
        footercolor: '',
        fullscreen: 'no',
        hardwareback: 'yes',
        hidden: 'yes',
        toolbarposition: undefined,
      };

      const result = service.getOptionsString(inAppBrowserOpts);
      expect(result).toEqual(
        'footer=no,fullscreen=no,hardwareback=yes,hidden=yes'
      );
    });
  });

  describe('openSystemBrowser', () => {
    it('should open system browser with url', () => {
      const link = 'https://test.com';
      service.openSystemBrowser(link);

      expect(cordovaInAppSpy.open).toHaveBeenCalledWith(link, '_system');
    });
  });

  describe('openInAppBrowser', () => {
    let browserMock;

    beforeEach(() => {
      spyOn(service, 'getOptionsString').and.returnValue('toolbar=no');

      browserMock = {
        addEventListener: jasmine.createSpy('addEventListener'),
      };
      cordovaInAppSpy.open.and.returnValue(browserMock);
      service['browserOpen'] = false;
    });

    it('should open in app browser, set up controller and call openInAppBrowser when platform resumes if no resumeCallback in the controller and browser is not already open', fakeAsync(async () => {
      class AController implements IABController {
        browser: InAppBrowserObject;
        loadingController: LoadingController;
        browserOptions: InAppBrowserOptions = {
          toolbar: 'no',
          beforeload: 'yes',
        };
        cordovaInApp: any;
        beforeLoadCallback() {
          console.log('beforeload');
        }
        loadStartCallback() {
          console.log('loadStart');
        }
        loadStopCallback() {
          console.log('loadStop');
        }
        exitCallback() {
          console.log('exit');
        }
        messageCallback() {
          console.log('message');
        }
        displayCustomHeader(headerText?: string) {
          console.log(headerText);
        }
      }

      const controller = new AController();

      const result = await service.openInAppBrowser(
        'https://test.com',
        controller
      );

      expect(cordovaInAppSpy.open).toHaveBeenCalledWith(
        'https://test.com',
        '_blank',
        'toolbar=no'
      );
      expect(browserMock.addEventListener).toHaveBeenCalledTimes(6);
      expect(browserMock.addEventListener).toHaveBeenCalledWith(
        'beforeload',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).toHaveBeenCalledWith(
        'loadstart',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).toHaveBeenCalledWith(
        'loadstop',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).toHaveBeenCalledWith(
        'message',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).toHaveBeenCalledWith(
        'exit',
        jasmine.any(Function)
      );

      spyOn(service, 'openInAppBrowser');
      expect(service['browserOpen']).toBeTrue();
      tick(1);
      expect(service['browserOpen']).toBeFalse();
      expect(service.openInAppBrowser).toHaveBeenCalledWith(
        'https://test.com',
        controller
      );

      expect(result).toEqual(browserMock);
    }));

    it('should call controllers resumeCallback when platform resumes if present', fakeAsync(async () => {
      class AController implements IABController {
        browser: InAppBrowserObject;
        loadingController: LoadingController;
        browserOptions: InAppBrowserOptions = {
          toolbar: 'no',
          beforeload: 'yes',
        };
        cordovaInApp: any;
        resumeCallback() {
          console.log('resumecallback');
        }
        displayCustomHeader(headerText?: string) {
          console.log(headerText);
        }
      }

      const controller = new AController();

      await service.openInAppBrowser('https://test.com', controller);

      spyOn(controller, 'resumeCallback');
      tick(1);

      expect(controller.resumeCallback).toHaveBeenCalled();
    }));

    it('should unsubscribe from subscription if it is set', async () => {
      class AController implements IABController {
        browser: InAppBrowserObject;
        loadingController: LoadingController;
        browserOptions: InAppBrowserOptions = {
          toolbar: 'no',
          beforeload: 'yes',
        };
        cordovaInApp: any;
        displayCustomHeader(headerText?: string) {
          console.log(headerText);
        }
        resumeCallback() {
          console.log('resumecallback');
        }
      }
      const controller = new AController();
      const subscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      service['subscripton'] = subscriptionSpy;
      await service.openInAppBrowser('https://test.com', controller);
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });

    it('should open browser and not subscribe to callbacks if they are not there', async () => {
      class AController implements IABController {
        browser: InAppBrowserObject;
        loadingController: LoadingController;
        browserOptions: InAppBrowserOptions = {
          toolbar: 'no',
          beforeload: 'yes',
        };
        cordovaInApp: any;
        displayCustomHeader(headerText?: string) {
          console.log(headerText);
        }
        resumeCallback() {
          console.log('resumecallback');
        }
      }

      const controller = new AController();
      await service.openInAppBrowser('https://test.com', controller);
      expect(browserMock.addEventListener).toHaveBeenCalledTimes(1);
      expect(browserMock.addEventListener).not.toHaveBeenCalledWith(
        'beforeload',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).not.toHaveBeenCalledWith(
        'loadstart',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).not.toHaveBeenCalledWith(
        'loadstop',
        jasmine.any(Function)
      );
      expect(browserMock.addEventListener).not.toHaveBeenCalledWith(
        'message',
        jasmine.any(Function)
      );
    });

    it('should not open the browser again if browser is already open', fakeAsync(async () => {
      class AController implements IABController {
        browser: InAppBrowserObject;
        loadingController: LoadingController;
        browserOptions: InAppBrowserOptions = {
          toolbar: 'no',
          beforeload: 'yes',
        };
        cordovaInApp: any;
        beforeLoadCallback() {
          console.log('beforeload');
        }
        loadStartCallback() {
          console.log('loadStart');
        }
        loadStopCallback() {
          console.log('loadStop');
        }
        exitCallback() {
          console.log('exit');
        }
        messageCallback() {
          console.log('message');
        }
        displayCustomHeader(headerText?: string) {
          console.log(headerText);
        }
      }

      const controller = new AController();
      service['browserOpen'] = true;

      await service.openInAppBrowser('https://test.com', controller);

      expect(cordovaInAppSpy.open).not.toHaveBeenCalled();
    }));
  });

  describe('ngOnDestroy', () => {
    let subscriptionSpy;
    beforeEach(() => {
      subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    });

    it('should unsubscribe', () => {
      service['subscripton'] = subscriptionSpy;
      service.ngOnDestroy();
      expect(service['subscripton'].unsubscribe).toHaveBeenCalled();
    });
  });
});
