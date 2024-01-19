import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AllCovergesPage} from './all-coverages.page';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';

describe('AllCovergesPage', () => {
  let component: AllCovergesPage;
  let fixture: ComponentFixture<AllCovergesPage>;
  let routerSpy;
  let platformServiceSpy;
  let accessServiceSpy;
  let routerNavSpy;
  let consentServiceSpy;
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
    enableBST: 'N',
    enableTPA: 'N',
    enableMyVoyage: 'N',
    isHealthOnly: false,
    myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
  };
  let observableForGaveConsent;
  let subscriptionForGaveConsent;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl'], {
        events: of(
          new NavigationEnd(
            0,
            '/coverages/all-coverages/insights',
            '/coverages/all-coverages/insights'
          )
        ),
      });
      platformServiceSpy = jasmine.createSpyObj('platformServiceSpy', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue({
        subscribe: () => undefined,
      });
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      observableForGaveConsent = of(true);
      subscriptionForGaveConsent = new Subscription();
      spyOn(observableForGaveConsent, 'subscribe').and.callFake(f => {
        f(true);
        return subscriptionForGaveConsent;
      });
      consentServiceSpy = jasmine.createSpyObj('ConsentService', [], {
        justGaveConsent: observableForGaveConsent,
      });
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockAccessData)
      );

      TestBed.configureTestingModule({
        declarations: [AllCovergesPage],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: ConsentService, useValue: consentServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(AllCovergesPage);
      component = fixture.componentInstance;

      routerNavSpy = spyOn(component, 'routerNavigation');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      component.isDesktop = false;
      spyOn(component.subscription, 'add');
      component.justGaveConsent = false;
    });
    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('should set isDesktop', () => {
      component.ngOnInit();
      expect(component.isDesktop).toEqual(true);
      expect(platformServiceSpy.isDesktop).toHaveBeenCalled();
    });
    it('should set the value of justGaveConsent', () => {
      component.ngOnInit();
      expect(component.justGaveConsent).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(
        subscriptionForGaveConsent
      );
    });
  });

  describe('gotConsentVisibiltyChanged', () => {
    it('should set offsetTop to 160 if visible', () => {
      component.offsetTop = 0;
      component.gotConsentVisibiltyChanged(true);
      expect(component.offsetTop).toEqual(160);
    });

    it('should set offsetTop to 160 if visible', () => {
      component.offsetTop = 160;
      component.gotConsentVisibiltyChanged(false);
      expect(component.offsetTop).toEqual(0);
    });
  });

  describe('routerNavigation', () => {
    beforeEach(() => {
      routerNavSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      spyOn(component, 'handelEventUrl');
    });
    it('should call handelEventUrl', () => {
      component.routerNavigation();
      expect(component.handelEventUrl).toHaveBeenCalled();
      expect(component.subscription.add).toHaveBeenCalled();
    });
  });

  describe('handelEventUrl', () => {
    beforeEach(() => {
      spyOn(component, 'managingTabs');
      component.selectedTab = undefined;
    });
    it('When selectedTab would be insights', () => {
      component.handelEventUrl('/coverages/all-coverages/insights');
      expect(component.selectedTab).toEqual('insights');
    });
    it('should call managingTabs', () => {
      component.handelEventUrl('/coverages');
      expect(component.managingTabs).toHaveBeenCalled();
    });
    it('should not call managingTabs', () => {
      component.handelEventUrl('/coverages/view-plans/bkUzB3q876hc/details');
      expect(component.managingTabs).not.toHaveBeenCalled();
    });
  });

  describe('managingTabs', () => {
    it('when enableTPA would be Y and enableBST is N', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          ...mockAccessData,
          ...{enableBST: 'N', enableTPA: 'Y'},
        })
      );

      await component.managingTabs();
      expect(component.pageData.tabs).toEqual([
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'My Claims',
          link: 'tpaclaims',
        },
        {
          label: 'Benefit Elections',
          link: 'elections',
        },
      ]);
      expect(component.pageData.defaultTab).toEqual([
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'My Claims',
          link: 'tpaclaims',
        },
        {
          label: 'Coverages',
          link: 'plans',
        },
      ]);
    });

    it('when enableBST would be Y and tpa N', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          ...mockAccessData,
          ...{enableBST: 'Y', enableTPA: 'N'},
        })
      );

      await component.managingTabs();
      expect(component.pageData.tabs).toEqual([
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'My Claims',
          link: 'claims',
        },
        {
          label: 'Benefit Elections',
          link: 'elections',
        },
      ]);
      expect(component.pageData.defaultTab).toEqual([
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'My Claims',
          link: 'claims',
        },
        {
          label: 'Coverages',
          link: 'plans',
        },
      ]);
    });

    it('when enableBST would be N and tpa N', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          ...mockAccessData,
          ...{enableBST: 'N', enableTPA: 'N'},
        })
      );

      await component.managingTabs();
      expect(component.pageData.tabs).toEqual([
        {
          label: 'Benefit Elections',
          link: 'elections',
        },
      ]);
      expect(component.pageData.defaultTab).toEqual([
        {
          label: 'Coverages',
          link: 'plans',
        },
      ]);
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
