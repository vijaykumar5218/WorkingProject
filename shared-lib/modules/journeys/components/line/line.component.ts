import {Component, Input} from '@angular/core';
import {StepContentElement} from '../../../../../shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent {
  @Input() element: StepContentElement;
}
