import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  JourneyStep,
  StepContentElement,
  JourneyResponse,
  SwipeEnabledEvent,
  ContinueEvent,
} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'journeys-steps-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class StepComponent implements OnInit {
  @Input() step: JourneyStep;
  @Input() index: number;
  @Input() currentStep: number;
  @Output() continueClick = new EventEmitter<ContinueEvent>();
  @Output() backClick = new EventEmitter<void>();
  @Input() journeyId: number;
  @Output() swipeEnabled = new EventEmitter<SwipeEnabledEvent>();
  continueButtonEnabled = true;
  imageValue: string;
  isWeb: boolean;
  journeys$: Observable<JourneyResponse>;
  journeyApiData$: Observable<Record<number, Record<string, any>>>;
  private requiredAnswerIds: string[] = [];
  journeyServiceMap: Record<number, any>;
  @Output() updateStep = new EventEmitter<Record<string, string | string[]>>();

  constructor(
    private utilitySerivce: SharedUtilityService,
    private journeyService: JourneyService
  ) {
    this.journeyServiceMap = this.journeyService.journeyServiceMap;
  }

  ngOnInit() {
    this.isWeb = this.utilitySerivce.getIsWeb();
    this.journeys$ = this.journeyService.fetchJourneys();
    if (this.step.answer && !this.step.value) {
      this.step.value = this.journeyService.safeParse(
        this.step.answer
      ) as Record<string, string | string[]>;
    }
  }

  handleContinueClick(event: ContinueEvent) {
    this.continueClick.emit(event);
  }

  handleBackClick() {
    this.backClick.emit();
  }

  updateStepValueAndStep(value: string, element: StepContentElement) {
    this.updateStepValue(value, element);
    this.updateStepHandler();
  }

  updateStepHandler() {
    this.updateStep.emit(this.step.value);
  }

  updateStepValue(value: string, element: StepContentElement) {
    if (!this.step.value) {
      this.step.value = {};
    }
    if (!element.accumulateAnswers) {
      this.step.value[element.answerId] = value;
    } else {
      if (this.step.value[element.answerId]) {
        (this.step.value[element.answerId] as string[]).push(value);
      } else {
        this.step.value[element.answerId] = [value];
      }
    }
    this.checkForContinue();
  }

  checkForContinue() {
    let requiredCompleted = true;
    this.requiredAnswerIds.forEach(id => {
      if (
        this.journeyService.isValueEmpty(this.step.value[id]) &&
        !this.isRequiredInputSetCompleted(id)
      ) {
        requiredCompleted = false;
      }
    });
    this.continueButtonEnabled = requiredCompleted;
    this.swipeEnabled.emit({
      swipeEnabled: requiredCompleted,
      index: this.index,
    });
  }

  private isRequiredInputSetCompleted(id: string): boolean {
    let result = false;
    if (this.step.content.requiredInputSets) {
      this.step.content.requiredInputSets.forEach(set => {
        if (set.includes(id)) {
          set.forEach(setId => {
            if (!this.journeyService.isValueEmpty(this.step.value[setId])) {
              result = true;
            }
          });
        }
      });
    }
    return result;
  }

  setRequired(required: boolean, element: StepContentElement) {
    if (required) {
      this.requiredAnswerIds.push(element.answerId);
      this.checkForContinue();
    }
  }

  updateImageValue(value: string) {
    this.imageValue = value;
  }
}
