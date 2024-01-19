import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

@Injectable({
  providedIn: 'root',
})
export class BenefitsGuard implements CanActivate {
  constructor(
    private benefitsService: BenefitsService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.setGuidelinesFlag();
    this.router.navigate(['/home'], {
      queryParams: route.queryParams,
    });
    return true;
  }

  setGuidelinesFlag() {
    this.benefitsService.isDeepLink = true;
    this.benefitsService.openGuidelines();
  }
}
