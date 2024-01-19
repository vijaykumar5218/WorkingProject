import {BenefitsGuard} from './benefits.guard';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BenefitsService} from '../../../shared-lib/services/benefits/benefits.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

describe('BenefitsGuard', () => {
  let benefitGuard: BenefitsGuard;
  let benefitServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'openGuidelines',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          BenefitsGuard,
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      });
      benefitGuard = TestBed.inject(BenefitsGuard);
    })
  );

  it('should be created', () => {
    expect(benefitGuard).toBeTruthy();
  });

  describe('canActivate', () => {
    let mockRoute: ActivatedRouteSnapshot;
    beforeEach(() => {
      spyOn(benefitGuard, 'setGuidelinesFlag');
      mockRoute = {
        url: undefined,
        params: undefined,
        queryParams: {
          source: 'email',
          redirect_route: '/home/guidelines',
        },
        fragment: undefined,
        data: undefined,
        outlet: undefined,
        component: undefined,
        routeConfig: undefined,
        root: undefined,
        parent: undefined,
        firstChild: undefined,
        children: undefined,
        pathFromRoot: undefined,
        paramMap: undefined,
        queryParamMap: undefined,
      };
    });
    it('when canActivate is called it should route to home and call setGuidelinesFlag method', () => {
      const result = benefitGuard.canActivate(mockRoute);
      expect(result).toBe(true);
      expect(benefitGuard.setGuidelinesFlag).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
        queryParams: mockRoute.queryParams,
      });
    });
  });
  describe('setGuidelinesFlag', () => {
    it('when it return true', () => {
      benefitServiceSpy.isDeepLink = false;
      benefitGuard.setGuidelinesFlag();
      expect(benefitServiceSpy.openGuidelines).toHaveBeenCalled();
      expect(benefitServiceSpy.isDeepLink).toEqual(true);
    });
  });
});
