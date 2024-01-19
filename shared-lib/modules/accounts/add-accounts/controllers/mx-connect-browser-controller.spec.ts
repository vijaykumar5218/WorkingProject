import {TestBed} from '@angular/core/testing';
import {InAppBrowserEvent} from '@ionic-native/in-app-browser';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {MXConnectBrowserController} from './mx-connect-browser-controller';

describe('MXConnectBrowserController', () => {
  let controller: MXConnectBrowserController;
  let browserSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MXConnectBrowserController],
    }).compileComponents();
    controller = TestBed.inject(MXConnectBrowserController);

    browserSpy = jasmine.createSpyObj('Browser', ['close']);
    controller.browser = browserSpy;
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });

  describe('loadStartCallback', () => {
    it('should close browser if url is our schema', () => {
      spyOn(VoyaIABController.prototype, 'loadStartCallback');

      const iabEvent = {
        url: 'com.voya.edt.myvoyage://mxconnect',
      } as InAppBrowserEvent;

      controller.loadStartCallback(iabEvent);

      expect(VoyaIABController.prototype.loadStartCallback).toHaveBeenCalled();
      expect(browserSpy.close).toHaveBeenCalled();
    });

    it('should not close browser if url is not our schema', () => {
      spyOn(VoyaIABController.prototype, 'loadStartCallback');

      const iabEvent = {
        url: 'https://mxconnect.com',
      } as InAppBrowserEvent;

      controller.loadStartCallback(iabEvent);

      expect(VoyaIABController.prototype.loadStartCallback).toHaveBeenCalled();
      expect(browserSpy.close).not.toHaveBeenCalled();
    });
  });
});
