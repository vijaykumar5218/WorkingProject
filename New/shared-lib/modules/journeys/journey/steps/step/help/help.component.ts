import {Component, Input} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {StepContentHelp} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  @Input() help: StepContentHelp;
  @Input() idSuffix: string;

  constructor(private journeyService: JourneyService) {}

  async openHelpModal() {
    this.journeyService.openModal(
      {
        element: {
          id: 'help',
          ...this.help,
        },
      },
      false
    );
  }
}
