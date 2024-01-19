import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-add-child-button',
  templateUrl: './add-child-button.component.html'
})
export class AddChildButtonComponent {
  @Input() element: StepContentElement;
}
