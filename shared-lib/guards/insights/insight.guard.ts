import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
@Injectable()
export class InsightsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.router.navigate(['/accounts/all-account/insights'], {
      queryParams: route.queryParams,
    });
    return true;
  }
}
