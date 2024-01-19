import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  Option,
  RadioButtonStepValue,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';

@Component({
  selector: 'journeys-steps-step-input-radio-button-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements OnInit {
  @Input() element: StepContentElement;
  @Output() radioButtonStateChanged = new EventEmitter<string>();
  @Input() value: string;
  elements: StepContentElement[];
  private answer: Record<string, string> = {};
  answerString: string;

  constructor(
    private journeyService: JourneyService,
    private utilityService: JourneyUtilityService
  ) {}

  ngOnInit() {
    this.answer = this.journeyService.safeParse(this.value) as Record<
      string,
      string
    >;
    this.answerString = this.value;
    const checkedAnswer = this.answer && this.answer[this.element.answerId];
    this.element.options?.forEach(option => {
      if (checkedAnswer === option.id || (!checkedAnswer && option.default)) {
        option.checked = true;
        const elementObj = this.utilityService.setElements(
          option.elements,
          true,
          this.element.idSuffix
        );
        this.elements = elementObj.elements;
      }
    });
  }

  radioButtonClicked(option: Option) {
    const newObject = this.utilityService.radioButtonClick(
      this.element,
      true,
      option,
      this.element.idSuffix
    );
    this.elements = newObject.elements;
    this.element = newObject.element;
    const newValue = {};
    newValue[this.element.answerId] = newObject.value;
    this.updateValue({value: newValue});
  }

  updateValue(event: RadioButtonStepValue) {
    this.answer = {...this.answer, ...event.value};
    let radioButtonFilled = true;
    if (this.journeyService.isValueEmpty(this.answer[this.element.answerId])) {
      radioButtonFilled = false;
      delete this.answer[this.element.answerId];
    }
    const state = this.utilityService.updateRadioStateValue(
      this.answer,
      radioButtonFilled,
      this.element,
      event.requiredCompleted,
      this.elements
    );
    this.radioButtonStateChanged.emit(state);
  }
}
