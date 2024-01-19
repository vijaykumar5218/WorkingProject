import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {of} from 'rxjs';
import {TPAWarningType} from '../../../services/tpa-stream/models/tpa.model';
import {SharedUtilityService} from '../../../services/utility/utility.service';
import {GroupingCategoryDetails} from '../models/chart.model';
import {TPAClaimsComponent} from './tpaclaims.component';
import {ElementRef} from '@angular/core';

describe('TPAClaimsComponent', () => {
  let component: TPAClaimsComponent;
  let fixture: ComponentFixture<TPAClaimsComponent>;
  let tpaServiceSpy;
  let tpaTestData: TPAClaimsData;
  let utilityServiceSpy;
  let routerSpy;
  let scrollToTopSpy;

  beforeEach(
    waitForAsync(() => {
      tpaTestData = {
        memberId: 12345,
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [
          {
            inNetwork: true,
            outOfPocketCost: 20,
            providerName: 'Test Provider',
            serviceDate: '2022-01-23',
            carrierName: 'Test Carrier',
          },
        ],
      };

      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', ['getTPAData'], {
        tpaDataReload$: of(null),
      });
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaTestData));

      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/coverages/all-coverages/tpaclaims',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };

      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getIsWeb',
        'scrollToTop',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(false);

      TestBed.configureTestingModule({
        declarations: [TPAClaimsComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: TPAStreamService, useValue: tpaServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TPAClaimsComponent);
      component = fixture.componentInstance;

      scrollToTopSpy = spyOn(component, 'scrollToTop');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load tpa data', fakeAsync(() => {
      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.tpaData).toEqual(tpaTestData);

      tick(250);
      expect(component.loading).toBeFalse();
    }));
  });

  describe('ionViewWillEnter', () => {
    it('should call scrollToTop', () => {
      component.ionViewWillEnter();
      expect(component.scrollToTop).toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      scrollToTopSpy.and.callThrough();
      spyOn(component.subscription, 'add');
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('When isWeb would be true', fakeAsync(() => {
      component.isWeb = true;
      component.scrollToTop();
      expect(routerSpy.events.pipe).toHaveBeenCalled();
      tick(100);
      expect(component.subscription.add).toHaveBeenCalled();
      expect(utilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    }));
    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.scrollToTop();
      expect(routerSpy.events.pipe).not.toHaveBeenCalled();
    });
  });

  describe('checkForErrors', () => {
    it('should add connection error if crawlStatus != SUCCESS', () => {
      component.tpaData = {
        memberId: 12345,
        claims: [],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 10,
            crawlStatus: 'SUCCESS',
            loginProblem: 'invalid',
            loginMessage: 'test error message',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
      };

      component.checkForErrors();

      expect(component.warnings).toEqual([
        {
          warningType: TPAWarningType.CONNECTION_ERROR,
          errorMessage: 'test error message',
          carrier: 'Test Carrier',
        },
      ]);
    });

    it('should add in progress error if crawlCount < 1', () => {
      component.tpaData = {
        memberId: 12345,
        claims: [],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        carriers: [
          {
            carrierId: 471393,
            carrierName: 'Test Carrier 2',
            claimsCount: 5,
            connectionStatus: 'Enabled',
            crawlCount: 0,
            crawlStatus: 'SUCCESS',
            loginProblem: 'valid',
            logoUrl:
              'https://tpastream-public.s3.amazonaws.com/test-tpastream.png',
            payerId: 1659,
            totalOutOfPocketAmount: 367.72,
          },
        ],
      };

      component.checkForErrors();

      expect(component.warnings).toEqual([
        {
          warningType: TPAWarningType.IN_PROCCESS,
          carrier: 'Test Carrier 2',
        },
      ]);
    });
  });

  describe('manageProviders', () => {
    it('should navigate to proper page if not web', () => {
      component.isWeb = false;
      component.manageProviders();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs/tpaproviders'
      );
    });

    it('should navigate to proper page if web', () => {
      component.isWeb = true;
      component.manageProviders();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims/providers'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      const spy = jasmine.createSpyObj('Sub', ['unsubscribe']);
      component['subscription'] = spy;
      component.ngOnDestroy();

      expect(spy.unsubscribe).toHaveBeenCalled();
    });
  });
});
