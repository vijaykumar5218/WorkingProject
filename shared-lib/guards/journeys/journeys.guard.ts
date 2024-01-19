import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JourneysGuard implements CanActivate {
  constructor(private journeyService: JourneyService) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    await this.setData(parseInt(route.params.id));
    return true;
  }

  async setData(jID: number) {
    const journeys = await firstValueFrom(this.journeyService.fetchJourneys());
    const journeyIndex = journeys.all.findIndex(
      journey => journey.journeyID === jID
    );
    if (journeyIndex != -1) {
      await this.journeyService.setStepContent(journeys.all[journeyIndex]);
      this.journeyService.setCurrentJourney(journeys.all[journeyIndex]);
    }
  }
}
