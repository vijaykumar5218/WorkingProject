import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {
  ContinueEvent,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-modal-generic-component',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss'],
})
export class ModalGenericComponent {
  requiredAnswerIds: string[] = [];
  @Input() element: StepContentElement;
  @Input() values: Record<string, string | string[]>;
  @Input() answer: string;
  requiredInputsFilled: boolean;
  private value: Record<string, string>;
  @Output() saveValue = new EventEmitter<string>();
  stepValue: Record<string, string>;
  stepAnswer: string;

  constructor(
    private journeyService: JourneyService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.element.accumulateAnswers) {
      this.stepValue = this.journeyService.safeParse(
        this.values && (this.values[this.element.answerId] as string)
      ) as Record<string, string>;
      if (this.stepValue) {
        this.value = this.stepValue;
      }
      if (this.answer) {
        const parsedAnswer = this.journeyService.safeParse(this.answer);
        this.stepAnswer = parsedAnswer && parsedAnswer[this.element.answerId];
      }
    }
  }

  handleContinueClick(event: ContinueEvent) {
    if (event.save) {
      if (!this.value.id) {
        this.value.id = Date.now().toString();
      }
      this.saveValue.emit(JSON.stringify(this.value));
      if (
        this.element.answerId === 'addAChildModal' &&
        this.element.accumulateAnswers
      ) {
        const currentJourney = this.journeyService.getCurrentJourney();
        this.journeyService.journeyServiceMap[
          currentJourney.journeyID
        ].addDependent(this.value);
      }
      this.journeyService.closeModal();
    }
  }

  setRequired(required: boolean, element: StepContentElement) {
    if (required) {
      this.requiredAnswerIds.push(element.answerId);
      this.checkForContinue();
    }
  }

  private checkForContinue() {
    let requiredCompleted = true;
    this.requiredAnswerIds.forEach(id => {
      if (!this.value || this.journeyService.isValueEmpty(this.value[id])) {
        requiredCompleted = false;
      }
    });
    this.requiredInputsFilled = requiredCompleted;
    this.changeDetectorRef.detectChanges();
  }

  updateElementValue(value: string, id: string) {
    if (!this.value) {
      this.value = {};
    }
    this.value[id] = value;
    this.checkForContinue();
  }

  handleSaveValue(value: string) {
    this.saveValue.emit(value);
  }
}
