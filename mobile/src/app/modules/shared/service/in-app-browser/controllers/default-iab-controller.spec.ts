import {TestBed} from '@angular/core/testing';
import {InAppBrowserEvent} from '@ionic-native/in-app-browser';
import {DefaultIABController} from './default-iab-controller';

describe('DefaultIABController', () => {
  let controller: DefaultIABController;
  let browserSpy;
  let cordovaInAppSpy;
  let loadingSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DefaultIABController],
    }).compileComponents();
    controller = TestBed.inject(DefaultIABController);

    browserSpy = jasmine.createSpyObj('Browser', [
      'executeScript',
      'insertCSS',
      'show',
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

  describe('loadStartCallback', () => {
    let mockLoader;
    beforeEach(() => {
      mockLoader = jasmine.createSpyObj('Loader', ['present']);
      loadingSpy.create.and.returnValue(Promise.resolve(mockLoader));
    });

    it('should show loader if flag is true', async () => {
      controller.showLoader = true;
      controller.firstLoad = true;
      await controller.loadStartCallback();

      expect(loadingSpy.create).toHaveBeenCalledWith({
        translucent: true,
      });
      expect(mockLoader.present).toHaveBeenCalled();
      expect(controller.firstLoad).toEqual(false);
    });
    it('should not show loader if flag is false', async () => {
      controller.showLoader = false;
      controller.firstLoad = true;
      await controller.loadStartCallback();

      expect(loadingSpy.create).not.toHaveBeenCalledWith({
        translucent: true,
      });
      expect(mockLoader.present).not.toHaveBeenCalled();
    });
    it('should not show loader if not first load', async () => {
      controller.showLoader = true;
      controller.firstLoad = false;
      await controller.loadStartCallback();

      expect(loadingSpy.create).not.toHaveBeenCalledWith({
        translucent: true,
      });
      expect(mockLoader.present).not.toHaveBeenCalled();
    });
  });

  describe('loadStopCallback', () => {
    it('should dismiss the loader if loadingPromise', async () => {
      controller['loadingPromise'] = Promise.resolve();
      await controller.loadStopCallback();
      expect(loadingSpy.dismiss).toHaveBeenCalled();
      expect(controller['loadingPromise']).toBeUndefined();
    });

    it('should not dismiss the loader if not loadingPromise', async () => {
      controller['loadingPromise'] = undefined;
      await controller.loadStopCallback();
      expect(loadingSpy.dismiss).not.toHaveBeenCalled();
    });
  });

  describe('messageCallback', () => {
    it('should open message event in external browser if it is an external link message', () => {
      const event: InAppBrowserEvent = {
        type: 'message',
        url: 'https://any.com',
        code: 0,
        message: '',
        data: {message: 'EX', url: 'https://a.com'},
      } as InAppBrowserEvent;
      spyOn(window, 'open');
      controller.messageCallback(event);
      expect(window.open).toHaveBeenCalledWith('https://a.com');
    });

    it('should close if message is "close"', () => {
      const event: InAppBrowserEvent = {
        type: 'message',
        url: 'https://any.com',
        code: 0,
        message: '',
        data: {message: 'C'},
      } as InAppBrowserEvent;

      controller.messageCallback(event);
      expect(browserSpy.close).toHaveBeenCalled();
    });
  });

  describe('displayCustomHeader', () => {
    it('should use default header text if it is null', () => {
      controller.displayCustomHeader();
      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code:
          "(function() {\n          if(!document.querySelector('.in_app_header')){\n            var body = document.querySelector('body');\n  \n            var title = document.getElementsByTagName('title')[0].innerHTML;\n            if(!title || true === false) {\n              title = 'Voya';\n            }\n    \n            var header = document.createElement('div');\n            header.classList.add('in_app_header');\n    \n            var spacer = document.createElement('div');\n            spacer.classList.add('header_spacer');\n    \n            var button = document.createElement('div'); \n            button.setAttribute('id','in_app_close');\n            button.innerHTML = 'Close';\n            button.classList.add('close_btn');\n            button.onclick = function() {\n              webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: 'C'}));\n            };\n  \n            var titleDiv = document.createElement('div');\n            titleDiv.innerHTML = title;\n            titleDiv.classList.add('title');\n  \n            var button2 = document.createElement('div'); \n            button2.innerHTML = 'Close';\n            button2.classList.add('right_btn');\n  \n            header.append(button);\n            header.append(titleDiv);\n            header.append(button2);\n            body.prepend(header);\n            body.prepend(spacer);\n          }\n        })()",
      });
    });

    it('should insert header script and header css with position fixed and relative if absolutePosition is false', () => {
      controller.displayCustomHeader('headerText');
      expect(browserSpy.executeScript).toHaveBeenCalledWith({
        code:
          "(function() {\n          if(!document.querySelector('.in_app_header')){\n            var body = document.querySelector('body');\n  \n            var title = document.getElementsByTagName('title')[0].innerHTML;\n            if(!title || true === false) {\n              title = 'headerText';\n            }\n    \n            var header = document.createElement('div');\n            header.classList.add('in_app_header');\n    \n            var spacer = document.createElement('div');\n            spacer.classList.add('header_spacer');\n    \n            var button = document.createElement('div'); \n            button.setAttribute('id','in_app_close');\n            button.innerHTML = 'Close';\n            button.classList.add('close_btn');\n            button.onclick = function() {\n              webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: 'C'}));\n            };\n  \n            var titleDiv = document.createElement('div');\n            titleDiv.innerHTML = title;\n            titleDiv.classList.add('title');\n  \n            var button2 = document.createElement('div'); \n            button2.innerHTML = 'Close';\n            button2.classList.add('right_btn');\n  \n            header.append(button);\n            header.append(titleDiv);\n            header.append(button2);\n            body.prepend(header);\n            body.prepend(spacer);\n          }\n        })()",
      });
      expect(browserSpy.insertCSS).toHaveBeenCalledWith({
        code: `.in_app_header {
          position: fixed;
          z-index: 999;
          font-size: 18px;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          color: black;
          background: #ffffff;
          width: 100%;
          box-shadow: 0 3px 4px rgba(57, 63, 72, 0.3);
          white-space: nowrap;
          overflow: hidden;
          font-weight: 600;
          text-overflow: ellipsis;
        }
        .title {
          flex-grow: 999;
          text-align: center;
          max-width: 65%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .header_spacer {
          position: relative;
          top: 0;
          left: 0;
          height: 60px;
          width: 100%;
        }
        .close_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          font-weight: normal;
        }
        .right_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          opacity: 0;
        }
        @media (min-width: 768px) {
          nav.navbar.fixed-top {
            top: 60px;
          }
          div.nav-bar.fixed-top {
            top: 127px !important;
          }
        }`,
      });
    });

    it('should insert header css with position absolute if absolutePosition is true', () => {
      controller.displayCustomHeader('headerText', true);
      expect(browserSpy.insertCSS).toHaveBeenCalledWith({
        code: `.in_app_header {
          position: absolute;
          z-index: 999;
          font-size: 18px;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          color: black;
          background: #ffffff;
          width: 100%;
          box-shadow: 0 3px 4px rgba(57, 63, 72, 0.3);
          white-space: nowrap;
          overflow: hidden;
          font-weight: 600;
          text-overflow: ellipsis;
        }
        .title {
          flex-grow: 999;
          text-align: center;
          max-width: 65%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .header_spacer {
          position: absolute;
          top: 0;
          left: 0;
          height: 60px;
          width: 100%;
        }
        .close_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          font-weight: normal;
        }
        .right_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          opacity: 0;
        }
        @media (min-width: 768px) {
          nav.navbar.fixed-top {
            top: 60px;
          }
          div.nav-bar.fixed-top {
            top: 127px !important;
          }
        }`,
      });
    });
  });
});
