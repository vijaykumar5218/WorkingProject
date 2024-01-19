import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ContinueEvent,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-modal-step-component',
  templateUrl: './modal-step.component.html',
  styleUrls: [],
})
export class ModalStepComponent {
  requiredAnswerIds: string[] = [];
  @Input() ele: StepContentElement;
  @Input() accumulateAnswers: boolean;
  @Input() values: Record<string, string | string[]>;
  @Input() answer: string;
  @Input() requiredInputsFilled: boolean;
  @Output() continueClick = new EventEmitter<ContinueEvent>();
  @Output() isRequired = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<string>();
  @Output() saveValue = new EventEmitter<string>();

  handleContinueClick(event: ContinueEvent) {
    this.continueClick.emit(event);
  }

  emitRequired(event: boolean) {
    this.isRequired.emit(event);
  }

  emitElementValue(value: string) {
    this.valueChange.emit(value);
  }

  handleSaveValue(value: string) {
    this.saveValue.emit(value);
  }
}
