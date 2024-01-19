import {TabsnavPage} from './tabsnav.component';
import {HttpClientModule} from '@angular/common/http';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FooterType} from '../constants/footerType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('TabsnavPage', () => {
  let router;
  let component: TabsnavPage;
  let fixture;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      TestBed.configureTestingModule({
        declarations: [TabsnavPage],

        imports: [
          HttpClientModule,
          ReactiveFormsModule,
          FormsModule,
          CommonModule,
          RouterTestingModule,
        ],
        providers: [
          RouterTestingModule,
          HTTP,
          {provide: Router, useValue: router},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
      fixture = TestBed.createComponent(TabsnavPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.isWeb = false;
      component.config = [];
    });

    it('When isWeb would be true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.config).toEqual([
        {
          text: 'Home',
          route: 'home',
          icon: 'assets/icon/tabsnav/home',
        },
        {
          text: 'Accounts',
          route: 'accounts',
          icon: 'assets/icon/tabsnav/accounts',
        },
        {
          text: 'Coverages',
          route: 'coverages',
          icon: 'assets/icon/tabsnav/coverages',
        },
        {
          text: 'Life Events',
          route: 'journeys-list',
          icon: 'assets/icon/tabsnav/journeys',
        },
        {
          text: 'More',
          route: 'more',
          icon: 'assets/icon/tabsnav/more',
        },
      ]);
    });

    it('When isWeb would be false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ngOnInit();
      expect(component.isWeb).toEqual(false);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.config).toEqual([
        {
          text: 'Home',
          route: 'home',
          icon: 'assets/icon/tabsnav/home',
        },
        {
          text: 'Accounts',
          route: 'account',
          icon: 'assets/icon/tabsnav/accounts',
        },
        {
          text: 'Coverages',
          route: 'coverages',
          icon: 'assets/icon/tabsnav/coverages',
        },
        {
          text: 'Life Events',
          route: 'journeys',
          icon: 'assets/icon/tabsnav/journeys',
        },
        {
          text: 'More',
          route: 'settings',
          icon: 'assets/icon/tabsnav/more',
        },
      ]);
    });
  });

  describe('ngOnChanges', () => {
    it('should update selectedTab if one is passed in', () => {
      const selectedTab = 'abc';
      component.selectedTab = undefined;
      component.info = {type: FooterType.tabsnav, selectedTab: selectedTab};
      component.ngOnChanges({
        info: {
          currentValue: {selectedTab: selectedTab},
          previousValue: undefined,
          firstChange: undefined,
          isFirstChange: undefined,
        },
      });
      expect(component.selectedTab).toEqual(selectedTab);
    });

    it('should not update selectedTab if one is not passed in', () => {
      const selectedTab = 'abc';
      component.selectedTab = selectedTab;
      component.ngOnChanges({
        info: {
          currentValue: {},
          previousValue: undefined,
          firstChange: undefined,
          isFirstChange: undefined,
        },
      });
      expect(component.selectedTab).toEqual(selectedTab);
    });

    it('should not update selectedTab if info is not passed in', () => {
      const selectedTab = 'abc';
      component.selectedTab = selectedTab;
      component.ngOnChanges({});
      expect(component.selectedTab).toEqual(selectedTab);
    });
  });

  describe('handleTabClick', () => {
    it('should set the selectedTab', () => {
      component.selectedTab = undefined;
      const selectedTab = 'abc';
      component.handleTabClick(selectedTab);
      expect(component.selectedTab).toEqual(selectedTab);
    });

    it('should navigate to the selectedTab', () => {
      const selectedTab = 'abc';
      component.handleTabClick(selectedTab);
      expect(router.navigateByUrl).toHaveBeenCalledWith(selectedTab);
    });
  });
});
