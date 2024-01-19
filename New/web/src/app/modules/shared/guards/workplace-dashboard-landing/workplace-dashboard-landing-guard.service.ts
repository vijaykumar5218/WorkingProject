import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkplaceDashboardLandingGuard implements CanActivate {
  constructor(private accessService: AccessService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.accessService.isMyWorkplaceDashboardEnabled().pipe(
      map(res => {
        if (!res) {
          this.router.navigate(['/'], {
            queryParams: route.queryParams,
          });
        }
        return true;
      })
    );
  }
}
