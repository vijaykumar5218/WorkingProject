import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {PrivacyPage} from './privacy.page';
import {PrivacyBrowserController} from './controllers/privacy-browser-controller';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let fixture: ComponentFixture<PrivacyPage>;
  let headerTypeServiceSpy;
  let inAppBrowserServiceSpy;
  let sharedUtilityServiceSpy;
  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      inAppBrowserServiceSpy = jasmine.createSpyObj('InAppBroserService', [
        'openInAppBrowser',
      ]);

      TestBed.configureTestingModule({
        declarations: [PrivacyPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {
            provide: InAppBroserService,
            useValue: inAppBrowserServiceSpy,
          },
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PrivacyPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Privacy',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
  });

  describe('goToPrivacyWebView', () => {
    it('Should call in-appbrowser service  when isWeb would be false', () => {
      component.isWeb = false;
      component.goToPrivacyWebView();
      expect(inAppBrowserServiceSpy.openInAppBrowser).toHaveBeenCalledWith(
        'https://www.voya.com/privacy-notice',
        new PrivacyBrowserController()
      );
    });
    it('window open get called when isWeb would be true', () => {
      component.isWeb = true;
      spyOn(window, 'open').and.returnValue(window);
      component.goToPrivacyWebView();
      expect(window.open).toHaveBeenCalledWith(
        component.privacyText.privacyNotice.url,
        '_blank'
      );
    });
  });
});
