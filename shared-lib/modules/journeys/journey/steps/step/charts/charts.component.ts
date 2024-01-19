import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
@Component({
  selector: 'journey-step-charts',
  templateUrl: './charts.component.html',
})
export class ChartsComponent {
  @Input() element: StepContentElement;
}
