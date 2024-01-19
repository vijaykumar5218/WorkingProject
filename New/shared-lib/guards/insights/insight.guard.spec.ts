import {InsightsGuard} from './insight.guard';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRouteSnapshot, Router} from '@angular/router';

describe('InsightsGuard', () => {
  let service: InsightsGuard;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigate']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [InsightsGuard, {provide: Router, useValue: routerSpy}],
      });
      service = TestBed.inject(InsightsGuard);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    let mockRoute: ActivatedRouteSnapshot;
    beforeEach(() => {
      mockRoute = {
        url: undefined,
        params: undefined,
        queryParams: {
          source: 'email',
          redirect_route: '/accounts/all-account/insights',
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
    it('navigate to insights', () => {
      const result = service.canActivate(mockRoute);
      expect(result).toBe(true);
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/accounts/all-account/insights'],
        {
          queryParams: mockRoute.queryParams,
        }
      );
    });
  });
});
