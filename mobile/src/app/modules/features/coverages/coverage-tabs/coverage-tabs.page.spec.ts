import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {CoverageTabsPage} from './coverage-tabs.page';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {RouterTestingModule} from '@angular/router/testing';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {of} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import * as pText from '@shared-lib/components/coverages/constants/text-data.json';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {Component} from '@angular/core';

@Component({selector: 'ion-tabs', template: ''})
class MockIonTabs {}

describe('CoverageTabsPage', () => {
  let component: CoverageTabsPage;
  let fixture: ComponentFixture<CoverageTabsPage>;
  let headerTypeServiceSpy;
  let footerTypeServiceSpy;
  let benefitsServiceSpy;
  let subscriptionSpy;
  let accessServiceSpy;
  let manageTabsSpy;
  let routerSpy;
  const pageText = pText;
  const mockAccessData = {
    clientId: 'KOHLER',
    clientDomain: 'kohler.intg.voya.com',
    clientName: 'Kohler Co. 401(k) Savings Plan',
    planIdList: [
      {
        planId: '623040',
        active: true,
        benefitsAdminSystem: 'ADP',
      },
    ],
    firstTimeLogin: false,
    platform: 'ADP',
    currentPlan: {
      planId: '623040',
      active: true,
      benefitsAdminSystem: 'ADP',
    },
    enableMX: true,
    enableMyVoyage: 'N',
    isHealthOnly: false,
    myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
  };

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getBenefits',
        'getSelectedTab$',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableBST: 'N'}})
      );
      benefitsServiceSpy.getBenefits.and.returnValue(Promise.resolve());

      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      routerSpy.url = '/coverages/coverage-tabs';

      TestBed.configureTestingModule({
        declarations: [CoverageTabsPage, MockIonTabs],
        imports: [RouterTestingModule],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CoverageTabsPage);
      component = fixture.componentInstance;
      manageTabsSpy = spyOn(component, 'managingTabs');
      subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['selectedTabSubscription'] = subscriptionSpy;
      benefitsServiceSpy.getSelectedTab$.and.returnValue(of('test-tab'));
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call managingTabs', () => {
      expect(component.managingTabs).toHaveBeenCalled();
    });

    it('should subscribe to benefitsService getSelectedTab', () => {
      expect(benefitsServiceSpy.getSelectedTab$).toHaveBeenCalled();
      expect(component.selectedTab).toEqual('test-tab');
    });
  });

  describe('tabChange', () => {
    it('should call ionViewWillEnter', () => {
      spyOn(component, 'ionViewWillEnter');
      component.tabChange();
      expect(component.ionViewWillEnter).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Coverages',
        btnright: true,
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
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'coverages',
      });
    });
  });

  describe('routeToSelectedTab', () => {
    it('should set selectedTab to the last route part name if it exists', () => {
      routerSpy.url = '/coverages/coverage-tabs/plans';
      component.routeToSelectedTab();
      expect(component.selectedTab).toEqual('plans');
    });

    it('should set selectedTab to the last route part name if it exists and remove any path params', () => {
      routerSpy.url = '/coverages/coverage-tabs/plans?planType=test';
      component.routeToSelectedTab();
      expect(component.selectedTab).toEqual('plans');
    });

    it(' should redirect to tpa claims page when component.selecteTab="tpaclaims" ', () => {
      component.selectedTab = 'tpaclaims';
      component.routeToSelectedTab();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/tpaclaims'
      );
    });

    it(' should redirect to claims page when component.selecteTab="claims" ', () => {
      component.selectedTab = 'claims';
      component.routeToSelectedTab();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/claims'
      );
    });

    it(' should redirect to insights page when component.selecteTab="insights" ', () => {
      component.selectedTab = 'insights';
      component.routeToSelectedTab();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/insights'
      );
    });

    it(' should redirect to plans  page when component.selecteTab="plans" ', () => {
      component.selectedTab = 'plans';
      component.routeToSelectedTab();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/coverage-tabs/plans'
      );
    });
  });

  describe('handleClick', () => {
    it('should update the selected tab to the tab that was clicked using link if it is there', () => {
      const selectedTabLink = 'selectedTab';
      const selectedTab: SubHeaderTab = {link: selectedTabLink, label: 'label'};
      component.selectedTab = undefined;
      component.handleClick(selectedTab);
      expect(component.selectedTab).toEqual(selectedTabLink);
    });
  });

  describe('managingTabs', () => {
    let myClaimsTab;
    let myClaimsBstTab;
    let insightsTab;
    let plansTab;

    beforeEach(() => {
      manageTabsSpy.and.callThrough();

      myClaimsTab = {
        label: pageText.myClaims,
        link: 'tpaclaims',
      };
      myClaimsBstTab = {
        label: pageText.myClaims,
        link: 'claims',
      };
      insightsTab = {
        label: pageText.insights,
        link: 'insights',
      };
      plansTab = {
        label: pageText.plans,
        link: 'plans',
      };

      spyOn(component, 'routeToSelectedTab');
    });

    it('should call routeToSelectedTab', async () => {
      await component.managingTabs();
      expect(component.routeToSelectedTab).toHaveBeenCalled();
    });

    it('should add tpa claims tab and plans tab if tpa enabled', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableBST: 'N', enableTPA: 'Y'} as AccessResult)
      );
      await component.managingTabs();

      expect(component.tabs).toEqual([insightsTab, myClaimsTab, plansTab]);
      expect(component.selectedTab).toEqual('insights');
    });

    it('should add insights tab and plans tab if bst enabled', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableBST: 'Y', enableTPA: 'N'} as AccessResult)
      );
      await component.managingTabs();

      expect(component.tabs).toEqual([insightsTab, myClaimsBstTab, plansTab]);
      expect(component.selectedTab).toEqual('insights');
    });

    it('should add only plans tab if tpa and bst disabled', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableBST: 'N', enableTPA: 'N'} as AccessResult)
      );
      await component.managingTabs();

      expect(component.tabs).toEqual([plansTab]);
      expect(component.selectedTab).toEqual('plans');
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      component['selectedTabSubscription'] = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
