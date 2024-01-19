import {TestBed} from '@angular/core/testing';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {PrivacyBrowserController} from './privacy-browser-controller';

describe('PrivacyBrowserController', () => {
  let controller: PrivacyBrowserController;
  let browserSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [PrivacyBrowserController],
    }).compileComponents();
    controller = TestBed.inject(PrivacyBrowserController);

    browserSpy = jasmine.createSpyObj('Browser', ['insertCSS']);
    controller.browser = browserSpy;
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });

  describe('loadStopCallback', () => {
    it('should insert some fixing css', () => {
      spyOn(VoyaIABController.prototype, 'loadStopCallback');

      controller.loadStopCallback();

      expect(VoyaIABController.prototype.loadStopCallback).toHaveBeenCalled();
      expect(browserSpy.insertCSS).toHaveBeenCalledWith({
        code:
          '.v-simpleTable { margin-right: 0px !important; margin-left: 0px !important; }',
      });
    });
  });
});
