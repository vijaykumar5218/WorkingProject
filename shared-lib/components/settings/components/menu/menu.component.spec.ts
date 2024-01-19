import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {HelpService} from '@shared-lib/services/help/help.service';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {MenuComponent} from './menu.component';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of} from 'rxjs';
import * as settingsOpts from './constants/menuOptions.json';
import {MenuOptions} from './model/menuConfig.model';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {QualtricsProperty} from '@shared-lib/services/qualtrics/constants/qualtrics-properties.enum';

describe('MenuComponent', () => {
  const settingsOptions: MenuOptions = settingsOpts;
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let routerSpy;
  let helpServiceSpy;
  let inAppBrowserServiceSpy;
  let mxServiceSpy;
  let qualtricsServiceSpy;
  const emptyAccoount = {} as MXAccount;
  let platformServiceSpy;
  let sharedUtilityServiceSpy;
  let processSpy;

  beforeEach(
    waitForAsync(() => {
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      helpServiceSpy = jasmine.createSpyObj('HelpService', ['setCategoryData']);
      inAppBrowserServiceSpy = jasmine.createSpyObj('InAppBrowserService', [
        'openInAppBrowser',
      ]);

      mxServiceSpy = jasmine.createSpyObj('MXService', ['getMxAccountConnect']);
      mxServiceSpy.getMxAccountConnect.and.returnValue(
        of({
          accounts: [emptyAccoount, emptyAccoount],
        })
      );

      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/help/help',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };

      qualtricsServiceSpy = jasmine.createSpyObj('QualtricsService', [
        'setProperty',
        'evaluateInterceptId',
      ]);

      TestBed.configureTestingModule({
        declarations: [MenuComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: HelpService, useValue: helpServiceSpy},
          {provide: InAppBroserService, useValue: inAppBrowserServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: QualtricsService, useValue: qualtricsServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
      processSpy = spyOn(component, 'processMxAccData');

      component.config = {
        items: [
          {
            id: settingsOptions.manageAcctsId,
            text: 'Manage Accounts',
            route: '',
          },
        ],
      };

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call mxService getMxAccountConnect and then processMxAccData with result', () => {
      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalled();
      expect(component.processMxAccData).toHaveBeenCalledWith({
        accounts: [emptyAccoount, emptyAccoount],
      });
    });
  });

  describe('processMxAccData', () => {
    beforeEach(() => {
      processSpy.and.callThrough();
      spyOn(component, 'waitForConfig').and.returnValue(Promise.resolve());
    });

    it('should leave manage accounts link if mx accounts arent there', async () => {
      const mxAccData = {
        accounts: [emptyAccoount, emptyAccoount],
      };

      await component.processMxAccData(mxAccData);

      expect(component.waitForConfig).toHaveBeenCalled();
      expect(component.config.items).toEqual([
        {
          id: 'manageAccounts',
          text: 'Manage Accounts',
          route: '',
        },
      ]);
    });

    it('should filter out manage accounts link if mx accounts arent there', async () => {
      const mxAccData = {
        accounts: [],
      };

      await component.processMxAccData(mxAccData);

      expect(component.waitForConfig).toHaveBeenCalled();
      expect(component.config.items).toEqual([]);
    });
  });

  describe('waitForConfig', () => {
    it('should check for config, and resolve if not empty', async () => {
      component.config = {
        items: [],
      };
      setTimeout(() => {
        component.config = {
          items: [
            {
              route: 'a',
              text: 'a',
            },
            {
              route: 'b',
              text: 'b',
            },
          ],
        };
      }, 1000);

      const time = new Date().getTime();

      await component.waitForConfig();

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeGreaterThan(500);
    });

    it('should check for config, and resolve if not empty resolve imediately', async () => {
      component.config = {
        items: [
          {
            route: 'a',
            text: 'a',
          },
          {
            route: 'b',
            text: 'b',
          },
        ],
      };

      const time = new Date().getTime();

      await component.waitForConfig();

      const timeAfter = new Date().getTime();
      const diff = timeAfter - time;

      expect(diff).toBeLessThan(50);
    });
  });

  describe('navigateTo', () => {
    beforeEach(() => {
      spyOn(component.menuClick, 'emit');
    });
    it('should call menuClick', async () => {
      await component.navigateTo({
        id: settingsOptions.feedbackId,
        route: '',
        text: 'Feedback',
      });
      expect(component.menuClick.emit).toHaveBeenCalled();
    });
    it('should call mxService.evaluateInterceptId if item is Feedback', async () => {
      component.isWeb = false;
      await component.navigateTo({
        id: settingsOptions.feedbackId,
        route: '',
        text: 'Feedback',
      });

      expect(qualtricsServiceSpy.setProperty).toHaveBeenCalledWith(
        QualtricsProperty.FEEDBACK,
        'true'
      );
      expect(qualtricsServiceSpy.evaluateInterceptId).toHaveBeenCalledWith(
        QualtricsIntercept.FEEDBACK_INTERCEPT,
        true
      );
      expect(qualtricsServiceSpy.setProperty).toHaveBeenCalledWith(
        QualtricsProperty.FEEDBACK,
        'false'
      );
    });

    it('should call mxService.evaluateInterceptId if item is Feedback', async () => {
      component.isWeb = true;
      await component.navigateTo({
        id: settingsOptions.feedbackId,
        route: 'feedback',
        text: 'Feedback',
      });
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('feedback');
    });

    it('should call inAppBrowserService.openInAppBrowser if item is Feedback and when isWeb would be false', () => {
      component.isWeb = false;
      component.navigateTo({
        id: settingsOptions.termsId,
        route: '',
        text: 'Terms of Use',
      });
      expect(inAppBrowserServiceSpy.openInAppBrowser).toHaveBeenCalledWith(
        settingsOptions.TCUrl,
        new VoyaIABController()
      );
    });

    it('should call window.open when isWeb would be true', () => {
      component.isWeb = true;
      spyOn(window, 'open').and.returnValue(window);
      component.navigateTo({
        id: settingsOptions.termsId,
        route: '',
        text: 'Terms of Use',
      });
      expect(window.open).toHaveBeenCalledWith(settingsOptions.TCUrl, '_blank');
    });

    it('should call router.navigateByUrl if normal menu option', () => {
      component.navigateTo({
        route: 'test-route',
        text: 'Item',
      });
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('test-route');
    });

    it('should call helpService.setCategoryData if normal menu option and isHelp', () => {
      const cat = {
        title: 'atitle',
        enableMyVoyage: false,
        questionList: [{description: '', enableMyVoyage: false, question: ''}],
      };

      component.isHelp = true;
      component.navigateTo({
        route: 'test-route',
        text: 'Item',
        category: cat,
      });
      expect(helpServiceSpy.setCategoryData).toHaveBeenCalledWith(cat);
    });
  });
});
