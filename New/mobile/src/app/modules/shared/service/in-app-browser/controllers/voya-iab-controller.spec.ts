import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DefaultIABController} from './default-iab-controller';
import {VoyaIABController} from './voya-iab-controller';

describe('VoyaIABController', () => {
  let controller: VoyaIABController;
  let browserSpy;
  let cordovaInAppSpy;
  let loadingSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [VoyaIABController],
    }).compileComponents();
    controller = TestBed.inject(VoyaIABController);

    browserSpy = jasmine.createSpyObj('Browser', [
      'executeScript',
      'insertCSS',
      'close',
    ]);
    cordovaInAppSpy = jasmine.createSpyObj('CordovaInApp', ['open']);
    loadingSpy = jasmine.createSpyObj('LoadingController', [
      'create',
      'dismiss',
    ]);
    controller.browser = browserSpy;
    controller.cordovaInApp = cordovaInAppSpy;
    controller.loadingController = loadingSpy;
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });

  describe('clearHeaderAndFooter', () => {
    it('should execute script to remove header and footer', () => {
      controller.clearHeaderAndFooter();

      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code: `(function() { 
            if(document.getElementsByTagName('header').length > 0) {
              document.getElementsByTagName('header')[0].remove();
            }
            })()`,
      });
      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code: `(function() { 
            if(document.getElementsByTagName('footer').length > 0) {
              document.getElementsByTagName('footer')[0].remove();
            }
            })()`,
      });
    });
  });

  describe('loadStopCallback', () => {
    it('should call fixLinks', fakeAsync(() => {
      spyOn(DefaultIABController.prototype, 'loadStopCallback');
      spyOn(controller, 'clearHeaderAndFooter');
      spyOn(controller, 'displayCustomHeader');
      spyOn(controller, 'fixLinks');

      controller.loadStopCallback();

      tick(251);

      expect(
        DefaultIABController.prototype.loadStopCallback
      ).toHaveBeenCalled();
      expect(controller.clearHeaderAndFooter).toHaveBeenCalled();
      expect(controller.displayCustomHeader).toHaveBeenCalled();
      expect(controller.fixLinks).toHaveBeenCalled();
    }));
  });

  describe('fixLinks', () => {
    it('should call excecute script to fix page links', () => {
      controller.fixLinks();
      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code: `
        (function() {
            for(let link of document.getElementsByTagName("a")) {
              if(link.href!='javascript:void(0);') {
                link.onclick=function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: "EX", url: link.href}));
                };
              }
            }
        })();
        `,
      });
    });
  });
});
