import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-contentLinkModal',
  templateUrl: './contentLinkModal.component.html',
  styleUrls: ['./contentLinkModal.component.scss'],
})
export class ContentLinkModalComponent {
  @Input() element: StepContentElement;
}
