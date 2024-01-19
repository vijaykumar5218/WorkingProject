import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JourneyStepGuard implements CanActivate {
  constructor(
    private journeyService: JourneyService,
    private journeyUtilityService: JourneyUtilityService
  ) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.checkComingSoon(parseInt(route.parent.params.id));
  }

  private async checkComingSoon(id: number): Promise<boolean> {
    let canActivate = true;
    const journeys = await firstValueFrom(this.journeyService.fetchJourneys());
    const journeyIndex = journeys.all.findIndex(
      journey => journey.journeyID === id
    );
    if (journeyIndex != -1) {
      const isComingSoon = this.journeyService.isComingSoon(
        journeys.all[journeyIndex]
      );
      if (isComingSoon) {
        this.journeyUtilityService.routeToFirstJourney(journeys);
        canActivate = false;
      }
    }
    return canActivate;
  }
}
