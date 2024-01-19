import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  StepContentElement,
  Option,
  RadioButtonStepValue,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
@Component({
  selector: 'journeys-steps-step-input-radio-button-circle-radio-button',
  templateUrl: './circle-radio-button.component.html',
  styleUrls: ['./circle-radio-button.component.scss'],
})
export class CircleRadioButtonComponent implements OnInit {
  @Input() element: StepContentElement;
  elements: StepContentElement[];
  private answer: Record<string, string> = {};
  @Output() radioButtonStateChanged = new EventEmitter<string>();
  @Input() value: string;
  answerString: string;
  @Input() isToggle: boolean;

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
    let optionSelected = false;
    this.element.options?.forEach(option => {
      if (checkedAnswer === option.id || (!checkedAnswer && option.default)) {
        optionSelected = true;
        this.radioButtonClicked(option);
      }
    });
    if (!optionSelected) {
      this.radioButtonStateChanged.emit(undefined);
    }
  }

  radioButtonClicked(option: Option) {
    const newObject = this.utilityService.radioButtonClick(
      this.element,
      this.isToggle,
      option,
      this.element.idSuffix
    );
    this.elements = newObject.elements;
    this.element = newObject.element;
    const newValue = {};
    newValue[this.element.answerId] = newObject.value;
    if (newObject.isRequiredValid && newObject.elements) {
      newObject.elements.forEach((ele, i) => {
        if (ele.isRequired) {
          if (
            !this.answer ||
            this.journeyService.isValueEmpty(
              this.answer[newObject.elements[i].answerId]
            )
          ) {
            newObject.isRequiredValid = false;
          }
        }
      });
    }
    this.updateValue({
      value: newValue,
      requiredCompleted: !newObject.isRequiredValid,
    });
    const service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
    if (service?.updateNoteValueForRadioOption && option.checked) {
      service.updateNoteValueForRadioOption(option, this.answer);
    }
  }
  updateValue(event: RadioButtonStepValue) {
    this.answer = {...this.answer, ...event.value};
    this.answerString = JSON.stringify(this.answer);
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
