import {Component, Input} from '@angular/core';
import {StepContentHelp} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})
export class HelpModalComponent {
  @Input() help: StepContentHelp;
}
