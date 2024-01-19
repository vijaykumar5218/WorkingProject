import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-summary-step-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
})
export class TextFieldSummaryComponent {
  @Input() element: StepContentElement;
  answer: string;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    this.answer = this.journeyService.isValueEmpty(this.element.answer)
      ? '-'
      : this.element.answer;
  }
}
