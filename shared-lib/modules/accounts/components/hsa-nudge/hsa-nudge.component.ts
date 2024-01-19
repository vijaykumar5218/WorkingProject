import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import * as pageText from './constants/hsa-nudge.json';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-hsa-nudge',
  templateUrl: './hsa-nudge.component.html',
  styleUrls: ['./hsa-nudge.component.scss'],
})
export class HSANudgeComponent {
  @Input() journeyId: number;
  content: Record<string, string> = pageText;
  loading = false;

  constructor(private router: Router, private journeyService: JourneyService) {}

  async linkClicked() {
    this.loading = true;
    const journeys = await firstValueFrom(this.journeyService.fetchJourneys());

    const hsaJourney = journeys.all.find(
      journey => journey.journeyID === this.journeyId
    );

    await this.journeyService.setStepContent(hsaJourney);
    this.journeyService.setCurrentJourney(hsaJourney);

    this.router.navigateByUrl('/journeys/journey/' + this.journeyId + '/steps');
    this.loading = false;
  }
}
