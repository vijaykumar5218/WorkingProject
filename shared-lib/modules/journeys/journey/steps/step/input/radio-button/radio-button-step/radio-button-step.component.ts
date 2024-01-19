import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  RadioButtonStepValue,
  StepContentElement,
} from '../../../../../../../../services/journey/models/journey.model';
import {JourneyService} from '../../../../../../../../services/journey/journey.service';

@Component({
  selector: 'journeys-steps-step-input-radio-button-step',
  templateUrl: './radio-button-step.component.html',
  styleUrls: ['./radio-button-step.component.scss'],
})
export class RadioButtonStepComponent implements OnInit {
  @Input() elements: StepContentElement[];
  private value: Record<string, string>;
  @Output() valueChange = new EventEmitter<RadioButtonStepValue>();
  @Input() answer: string;
  private requiredAnswerIds: string[] = [];
  flagMap: Record<string, Record<string, boolean>> = {};
  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    if (this.answer) {
      const value = this.journeyService.safeParse(this.answer);
      if (value) {
        this.elements.forEach(element => {
          if (
            element.id === 'input' &&
            !this.journeyService.isValueEmpty(value[element.answerId])
          ) {
            this.flagMap[element.answerId] = {showNote: true};
          }
        });
      }
    }
  }

  updateStepValue(value: string, id: string) {
    if (!this.value) {
      this.value = {};
    }
    this.value[id] = value;
    this.checkForValidation();
  }

  setRequired(required: boolean, element: StepContentElement) {
    if (required) {
      this.requiredAnswerIds.push(element.answerId);
      this.checkForValidation();
    }
  }

  checkForValidation() {
    let requiredCompleted = true;
    this.requiredAnswerIds.forEach(id => {
      if (this.journeyService.isValueEmpty(this.value[id])) {
        requiredCompleted = false;
      }
    });
    const obj = {
      value: this.value,
      requiredCompleted: requiredCompleted,
    };
    this.valueChange.emit(obj);
  }

  setShowNote(event: string, element: StepContentElement) {
    const service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
    const isFilled = !this.journeyService.isValueEmpty(event);
    if (isFilled && service?.updateNoteValue) {
      service.updateNoteValue(event, element);
    }
    this.flagMap[element.answerId] = {
      ...this.flagMap[element.answerId],
      showNote: isFilled,
    };
  }
}
