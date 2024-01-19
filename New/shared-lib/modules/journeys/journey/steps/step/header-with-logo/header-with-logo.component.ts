import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-steps-step-header-with-logo',
  templateUrl: './header-with-logo.component.html',
  styleUrls: ['./header-with-logo.component.scss'],
})
export class HeaderWithLogoComponent {
  @Input() element: StepContentElement;
  service: any;

  constructor(private journeyService: JourneyService) {
    this.service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
  }
}
