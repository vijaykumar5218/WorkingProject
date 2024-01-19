import {CoveragesGuard} from './coverages-guard.service';
import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AccessService} from '@shared-lib/services/access/access.service';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {of} from 'rxjs';
import {HeaderTypeService} from '../../services/header-type/header-type.service';

describe('CoveragesGuard', () => {
  let service: CoveragesGuard;
  let accessServiceSpy;
  let routerSpy;
  let headerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('headerTypeServiceSpy', [
        'publishSelectedTab',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
        'isMyWorkplaceDashboardEnabled',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);
      routerSpy.url = '/home';
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          CoveragesGuard,
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
      });
      service = TestBed.inject(CoveragesGuard);
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
    it('when myWorkplaceDashboardEnabled would be false', done => {
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(of(false));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableCoverages: true})
      );
      service.canActivate(mockRoute).subscribe(data => {
        expect(
          accessServiceSpy.isMyWorkplaceDashboardEnabled
        ).toHaveBeenCalled();
        expect(accessServiceSpy.checkMyvoyageAccess).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
        expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
          'COVERAGES'
        );
        expect(data).toEqual(true);
        done();
      });
    });
    describe('when myWorkplaceDashboardEnabled would be true', () => {
      beforeEach(() => {
        accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(
          of(true)
        );
      });
      it('when enableCoverages will be false', done => {
        accessServiceSpy.checkMyvoyageAccess.and.returnValue(
          Promise.resolve({enableCoverages: false})
        );
        service.canActivate(mockRoute).subscribe(data => {
          expect(
            accessServiceSpy.isMyWorkplaceDashboardEnabled
          ).toHaveBeenCalled();
          expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/home'], {
            queryParams: mockRoute.queryParams,
          });
          expect(
            headerTypeServiceSpy.publishSelectedTab
          ).not.toHaveBeenCalled();
          expect(data).toEqual(false);
          done();
        });
      });
      it('when enableCoverages will be true', done => {
        accessServiceSpy.checkMyvoyageAccess.and.returnValue(
          Promise.resolve({enableCoverages: true})
        );
        service.canActivate(mockRoute).subscribe(data => {
          expect(
            accessServiceSpy.isMyWorkplaceDashboardEnabled
          ).toHaveBeenCalled();
          expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          expect(data).toEqual(true);
          expect(headerTypeServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
            'COVERAGES'
          );
          done();
        });
      });
    });
  });
});
