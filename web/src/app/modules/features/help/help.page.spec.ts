import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HelpPage} from './help.page';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {HelpService} from '@shared-lib/services/help/help.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('HelpPage', () => {
  let component: HelpPage;
  let fixture: ComponentFixture<HelpPage>;
  let headerTypeServiceSpy;
  let routerSpy;
  let helpServiceSpy;
  let settingsServiceSpy;
  let accessServiceSpy;
  let routerNavigationSpy;
  let isfocusedOnRouterOutletSpy;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['scrollToTop']
      );
      helpServiceSpy = jasmine.createSpyObj('helpServiceSpy', [
        'getCategoryData',
        'isfocusedOnRouterOutlet',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
        'isMyWorkplaceDashboardEnabled',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('SettingsService', [
        'getSettingsDisplayFlags',
      ]);
      settingsServiceSpy.getSettingsDisplayFlags.and.returnValue(
        Promise.resolve({displayContactLink: true})
      );
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(false));
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(of('/help/faq')),
        },
        navigateByUrl: jasmine.createSpy(),
      };
      TestBed.configureTestingModule({
        declarations: [HelpPage],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: HelpService, useValue: helpServiceSpy},
          {provide: SettingsService, useValue: settingsServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpPage);
      component = fixture.componentInstance;
      routerNavigationSpy = spyOn(component, 'routerNavigation');
      isfocusedOnRouterOutletSpy = spyOn(component, 'isfocusedOnRouterOutlet');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.routerNavigation).toHaveBeenCalled();
    expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
      'HELP_ITEMS'
    );
    expect(component.isfocusedOnRouterOutlet).toHaveBeenCalled();
  });

  describe('isfocusedOnRouterOutlet', () => {
    let subscription;
    let observable;
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      subscription = new Subscription();
      observable = of(true);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      spyOn(component, 'onFocusElement');
      isfocusedOnRouterOutletSpy.and.callThrough();
      helpServiceSpy.isfocusedOnRouterOutlet.and.returnValue(observable);
    });
    it('should call onFocusElement when isfocusedOnRouterOutlet will be triggered', () => {
      component.isfocusedOnRouterOutlet();
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
      expect(helpServiceSpy.isfocusedOnRouterOutlet).toHaveBeenCalled();
      expect(component.onFocusElement).toHaveBeenCalled();
    });
  });

  describe('setMenuItems', () => {
    describe('when myWorkplaceDashboardEnabled will be true', () => {
      const mockMenuConfig = {
        items: [
          {
            id: 'help',
            route: '/help/faq',
            text: 'FAQs',
            icon: 'assets/icon/settings/help.svg',
          },
        ],
      };
      beforeEach(() => {
        component.myWorkplaceDashboardEnabled = true;
      });
      it('when displayContactLink will be true but enableMyVoyage will be N', () => {
        component.setMenuItems(true, 'N');
        expect(component.menuConfig).toEqual(mockMenuConfig);
      });
    });
    describe('when myWorkplaceDashboardEnabled will be false', () => {
      const mockMenuConfig = {
        items: [
          {
            id: 'help',
            route: '/help/faq',
            text: 'FAQs',
            icon: 'assets/icon/settings/help.svg',
          },
          {
            id: 'contactAdvisor',
            text: 'Contact a Professional',
            route: '/help/contact-a-coach',
            icon: 'assets/icon/settings/conatact_coach.svg',
          },
        ],
      };
      beforeEach(() => {
        component.myWorkplaceDashboardEnabled = false;
      });
      it('when displayContactLink will be false', () => {
        component.setMenuItems(false);
        expect(component.menuConfig).toEqual({
          items: [mockMenuConfig.items[0]],
        });
      });
      it('when displayContactLink will be true', () => {
        component.setMenuItems(true);
        expect(component.menuConfig).toEqual(mockMenuConfig);
      });
    });
  });

  describe('routerNavigation', () => {
    beforeEach(() => {
      routerNavigationSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      spyOn(component, 'fetchSelectedTab');
    });
    describe('when myWorkplaceDashboardEnabled will be false', () => {
      let observable;
      let subscription;
      let mockData;
      const mockCategoryData = {
        category: {
          title: 'Category A',
          questionList: [
            {
              question: 'How do to find my loans?',
              description: 'How to find my loans',
            },
          ],
        },
      };
      beforeEach(() => {
        mockData = '/help/faq/help-content';
        observable = of(mockData);
        subscription = new Subscription();
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(mockData);
          return subscription;
        });
        routerSpy.events.pipe.and.returnValue(observable);
      });
      it('should call scrollToTop', () => {
        component.routerNavigation();
        expect(sharedUtilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
          component.topmostElement
        );
      });
      it('should call fetchSelectedTab', () => {
        component.routerNavigation();
        expect(component.fetchSelectedTab).toHaveBeenCalledWith([
          '',
          'help',
          'faq',
          'help-content',
        ]);
        expect(component.subscription.add).toHaveBeenCalledWith(subscription);
      });
      it('when categoryData would be undefined', () => {
        helpServiceSpy.getCategoryData.and.returnValue(undefined);
        component.routerNavigation();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('help/faq');
      });
      it('when categoryData would be defined', () => {
        helpServiceSpy.getCategoryData.and.returnValue(mockCategoryData);
        component.routerNavigation();
        expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe('fetchSelectedTab', () => {
    beforeEach(() => {
      component.selectedTab = undefined;
      spyOn(component, 'setMenuItems');
    });
    describe('when myWorkplaceDashboardEnabled will be false', () => {
      beforeEach(() => {
        component.myWorkplaceDashboardEnabled = false;
        component.menuConfig.items = [
          {
            id: 'help',
            text: 'FAQ’s',
            route: '/help/faq/',
            icon: 'assets/icon/settings/Privacy.svg',
          },
        ];
      });
      it('should call setMenuItems and set selectedTab', async () => {
        await component.fetchSelectedTab(['', 'help', 'faq', 'help-content']);
        expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
        expect(accessServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
        expect(component.selectedTab).toEqual('more-items-help');
      });
      it('should not set selectedTab', async () => {
        component.menuConfig.items = [
          {
            text: 'FAQ’s',
            route: '/help/faq/',
            icon: 'assets/icon/settings/Privacy.svg',
          },
        ];
        await component.fetchSelectedTab(['']);
        expect(component.selectedTab).toEqual('more-items-undefined');
      });
    });
    it('when myWorkplaceDashboardEnabled will be true', async () => {
      const mockMyvoyageAccessData: any = {
        enableMyVoyage: 'Y',
      };
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
      component.myWorkplaceDashboardEnabled = true;
      component.menuConfig.items = [
        {
          id: 'help',
          text: 'FAQ’s',
          route: '/help/faq/',
          icon: 'assets/icon/settings/Privacy.svg',
        },
      ];
      await component.fetchSelectedTab(['', 'help', 'faq', 'help-content']);
      expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.selectedTab).toEqual('more-items-help');
    });
    it('when myWorkplaceDashboardEnabled will be true and enableMyVoyage is N to publishSelectedTab to FAQs', async () => {
      const mockMyvoyageAccessData: any = {
        enableMyVoyage: 'N',
      };
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockMyvoyageAccessData)
      );
      component.myWorkplaceDashboardEnabled = true;
      component.menuConfig.items = [
        {
          id: 'help',
          text: 'FAQs',
          route: '/help/faq/',
          icon: 'assets/icon/settings/Privacy.svg',
        },
      ];
      await component.fetchSelectedTab(['', 'help', 'faq', 'help-content']);
      expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.selectedTab).toEqual('more-items-help');
      expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'FAQS_NAVBAR_ITEM'
      );
    });
  });

  describe('onFocusElement', () => {
    let eleSpy;
    beforeEach(() => {
      eleSpy = jasmine.createSpyObj('eleSpy', ['focus']);
      component.focusedElementHelp = jasmine.createSpyObj('NativeEl', [''], {
        nativeElement: eleSpy,
      });
    });
    it('should foucus on ele', () => {
      component.onFocusElement();
      expect(eleSpy.focus).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
