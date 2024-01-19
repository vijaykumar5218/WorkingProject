import {Component, Input, EventEmitter, Output} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-contentLink',
  templateUrl: './contentLink.component.html',
  styleUrls: ['./contentLink.component.scss'],
})
export class ContentLinkComponent {
  @Input() element: StepContentElement;
  @Input() values: Record<string, string | string[]>;
  @Input() answer: string;
  @Output() valueChange = new EventEmitter<string>();
  service: any;

  constructor(public journeyService: JourneyService) {
    this.service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
  }

  openModal() {
    if (
      this.element.id === 'contentModal' &&
      this.element.type !== 'genericModal'
    ) {
      this.journeyService.openModal({
        element: this.element,
      });
    } else {
      this.journeyService.openModal({
        element: {
          ...this.element,
          id: 'genericModal',
        },
        values: this.values,
        answer: this.answer,
        saveFunction: this.saveFunction.bind(this),
      });
    }
  }

  saveFunction(value: string) {
    this.valueChange.emit(value);
  }
}
