import {DefaultIABController} from './default-iab-controller';
import {SavviIABController} from './savvi-iab-controller';
import {IABMessage} from '../constants/message.enum';

describe('SavviIABController', () => {
  let controller: SavviIABController;
  let inAppBrowserSpy;
  let openSavviServiceSpy;
  let browserSpy;
  let loadingSpy;

  beforeEach(() => {
    browserSpy = jasmine.createSpyObj('Browser', [
      'insertCSS',
      'executeScript',
    ]);
    inAppBrowserSpy = jasmine.createSpyObj('InAppBrowser', [
      'openInAppBrowser',
    ]);
    openSavviServiceSpy = jasmine.createSpyObj('OpenSavviService', [
      'exitCallback',
    ]);
    loadingSpy = jasmine.createSpyObj('LoadingController', [
      'create',
      'dismiss',
    ]);
    controller = new SavviIABController(inAppBrowserSpy, openSavviServiceSpy);
    controller.browser = browserSpy;
    controller.loadingController = loadingSpy;
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
    expect(controller.showLoader).toBeFalse();
  });

  describe('loadStopCallback', () => {
    beforeEach(() => {
      spyOn(DefaultIABController.prototype, 'loadStopCallback');
      spyOn(controller, 'displayCustomHeader');
    });

    it('should call super', () => {
      controller.loadStopCallback();

      expect(
        DefaultIABController.prototype.loadStopCallback
      ).toHaveBeenCalled();
    });

    it('should call displayCustomHeader and insertCSS', () => {
      controller.loadStopCallback();
      expect(controller.displayCustomHeader).toHaveBeenCalled();
      expect(browserSpy.insertCSS).toHaveBeenCalledWith({
        code: `
          #root {
            margin-top: 64px;
          }`,
      });
    });

    it('should execute script to listen for sign out event,set isMobile true in window.savvi and publish savvi.isMobile event in window', () => {
      const script = `
      document.addEventListener('signOutComplete', () => {
        webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: '${IABMessage.close}'}));
      });
      window.savvi = {isMobile: true};
      window.dispatchEvent(new CustomEvent('savvi.ismobile'));
    `;
      controller.loadStopCallback();
      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code: script,
      });
    });

    it('should dismiss the loader', () => {
      controller.loadStopCallback();
      expect(controller.loadingController.dismiss).toHaveBeenCalled();
    });
  });

  describe('openInAppBrowser', () => {
    it('should call inAppBrowser.openInAppBrowser', async () => {
      const savviUrl = 'savviUrl';
      await controller.openInAppBrowser(savviUrl);
      expect(inAppBrowserSpy.openInAppBrowser).toHaveBeenCalledWith(
        savviUrl,
        controller
      );
    });
  });

  describe('exitCallback', () => {
    it('should reset the benefits enrollment data', () => {
      controller.exitCallback();
      expect(openSavviServiceSpy.exitCallback).toHaveBeenCalled();
    });
  });

  describe('resumeCallback', () => {
    it('should return undefined', () => {
      expect(controller.resumeCallback()).toBeUndefined();
    });
  });
});
