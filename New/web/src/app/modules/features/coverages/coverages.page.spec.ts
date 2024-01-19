import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CoveragesPage} from './coverages.page';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {of} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('CoveragesPage', () => {
  let component: CoveragesPage;
  let fixture: ComponentFixture<CoveragesPage>;
  let footerTypeServiceSpy;
  let routerSpy;
  let accessServiceSpy;
  let routerNavigationSpy;

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
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      footerTypeServiceSpy = jasmine.createSpyObj('footerTypeServiceSpy', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [CoveragesPage],
        imports: [RouterTestingModule],
        providers: [
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {
            provide: Router,
            useValue: routerSpy,
          },
          {
            provide: AccessService,
            useValue: accessServiceSpy,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(CoveragesPage);
      component = fixture.componentInstance;
      routerNavigationSpy = spyOn(component, 'routerNavigation');
      fixture.detectChanges();
    })
  );

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call routerNavigation', () => {
      component.ngOnInit();
      expect(component.routerNavigation).toHaveBeenCalled();
    });
    it('should call checkWorkplaceAccess and set the value of myWorkplaceDashboardEnabled', () => {
      component.ngOnInit();
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(component.myWorkplaceDashboardEnabled).toEqual(true);
    });
  });

  describe('clickAllPlans', () => {
    beforeEach(() => {
      spyOn(component, 'focusOnElement');
    });
    it('when event is passed as the parameter of fun', () => {
      component.clickAllPlans();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/insights'
      );
      expect(component.focusOnElement).toHaveBeenCalled();
    });
  });
  describe('focusOnElement', () => {
    let eleSpy;
    beforeEach(() => {
      eleSpy = jasmine.createSpyObj('eleSpy', ['focus']);
      component.focusedElement = jasmine.createSpyObj('NativeEl', [''], {
        nativeElement: eleSpy,
      });
    });
    it('should foucus on ele', () => {
      component.focusOnElement();
      expect(eleSpy.focus).toHaveBeenCalled();
    });
  });
  describe('routerNavigation', () => {
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      spyOn(component, 'handelEventUrl');
      routerNavigationSpy.and.callThrough();
    });
    it('should call handelEventUrl', () => {
      component.routerNavigation();
      expect(component.handelEventUrl).toHaveBeenCalledWith(
        '/coverages/all-coverages/insights'
      );
      expect(component.subscription.add).toHaveBeenCalled();
    });
  });

  describe('handelEventUrl', () => {
    beforeEach(() => {
      spyOn(component, 'focusOnElement');
      component.isAllPlansSelected = false;
    });
    it('When isAllPlansSelected would be false', () => {
      component.handelEventUrl('/coverages/view-plans/bkUzB3q876hc');
      expect(component.isAllPlansSelected).toBe(false);
      expect(component.focusOnElement).toHaveBeenCalled();
    });
    it('When isAllPlansSelected and isReviewPage both would be true', () => {
      component.handelEventUrl('/coverages/review');
      expect(component.isReviewPage).toBe(true);
      expect(component.isAllPlansSelected).toBe(true);
      expect(component.focusOnElement).not.toHaveBeenCalled();
    });
    it('When isAllPlansSelected would be true and isReviewPage is false ', () => {
      component.handelEventUrl('/coverages/all-coverages');
      expect(component.isReviewPage).toBe(false);
      expect(component.isAllPlansSelected).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  it('ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
      type: FooterType.tabsnav,
      selectedTab: 'coverages',
    });
  });
});
