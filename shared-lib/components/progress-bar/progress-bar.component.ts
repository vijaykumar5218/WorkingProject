import {Component, Input} from '@angular/core';
import {StepContentElement} from '../../services/journey/models/journey.model';
@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() element: StepContentElement;
  @Input() decimalPlacesOfValue: string;
  @Input() decimalPlacesOfMaxValue: string;
}
