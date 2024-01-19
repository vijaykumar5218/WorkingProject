import {HomeGuard} from './home-guard.service';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AccessService} from '@shared-lib/services/access/access.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {of} from 'rxjs';

describe('HomeGuard', () => {
  let service: HomeGuard;

  let accessServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'isMyWorkplaceDashboardEnabled',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          HomeGuard,
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      });
      service = TestBed.inject(HomeGuard);
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
    it('when myWorkplaceDashboardEnabled would be true', done => {
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(true));
      service.canActivate(mockRoute).subscribe(data => {
        expect(
          accessServiceSpy.isMyWorkplaceDashboardEnabled
        ).toHaveBeenCalled();
        expect(data).toEqual(true);
        expect(routerSpy.navigate).toHaveBeenCalledWith(
          ['/workplace-dashboard'],
          {
            queryParams: mockRoute.queryParams,
          }
        );
        done();
      });
    });
    it('when myWorkplaceDashboardEnabled would be false', done => {
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(false));
      service.canActivate(mockRoute).subscribe(() => {
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
