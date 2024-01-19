import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
@Component({
  selector: 'journeys-steps-step-input-radio-button',
  templateUrl: './radio-button.component.html',
})
export class RadioButtonComponent {
  @Input() element: StepContentElement;
  @Output() radioButtonStateChanged = new EventEmitter<string>();
  @Input() value: string;

  emitValueChange(value: string) {
    this.radioButtonStateChanged.emit(value);
  }
}
