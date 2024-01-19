import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {from, Observable, of} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';
import {HeaderTypeService} from '../../services/header-type/header-type.service';

@Injectable({
  providedIn: 'root',
})
export class CoveragesGuard implements CanActivate {
  constructor(
    private accessService: AccessService,
    private router: Router,
    private headerTypeService: HeaderTypeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.accessService.isMyWorkplaceDashboardEnabled().pipe(
      concatMap(myWorkplaceDashboardEnabled => {
        if (myWorkplaceDashboardEnabled) {
          return from(this.accessService.checkMyvoyageAccess()).pipe(
            map(myvoyageAccess => {
              if (!myvoyageAccess.enableCoverages) {
                this.router.navigate([this.router.url], {
                  queryParams: route.queryParams,
                });
                return false;
              } else {
                this.headerTypeService.publishSelectedTab('COVERAGES');
                return true;
              }
            })
          );
        } else {
          this.headerTypeService.publishSelectedTab('COVERAGES');
          return of(true);
        }
      })
    );
  }
}
