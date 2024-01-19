import {Component, Input} from '@angular/core';
import {Status} from '@shared-lib/constants/status.enum';
import {ProgressBarStep} from './models/step-progress-bar-model';

@Component({
  selector: 'app-step-progress-bar',
  templateUrl: './step-progress-bar.component.html',
  styleUrls: ['./step-progress-bar.component.scss'],
})
export class StepProgressBarComponent {
  @Input() currentStep: number;
  @Input() steps: ProgressBarStep[];
  readonly status = Status;
}
