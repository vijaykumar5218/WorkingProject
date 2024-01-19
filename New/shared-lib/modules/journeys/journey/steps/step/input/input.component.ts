import {
  Component,
  EventEmitter,
  Host,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {InputService} from './service/input.service';
import {OrangeMoneyService} from '@shared-lib/modules/orange-money/services/orange-money.service';
import {CurrencyPipe} from '@angular/common';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'journeys-steps-step-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [InputService],
})
export class InputComponent implements OnInit {
  @Input() element: StepContentElement;
  @Input() values: Record<string, string | string[]>;
  @Input() answer: string;
  @Input() prefill = true;
  @Input() index: number;
  @Output() currentValue = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();
  @Output() isRequired = new EventEmitter<boolean>();
  @Output() updateStepValueAndStep = new EventEmitter<void>();
  @Output() blur = new EventEmitter<string>();
  value: string;
  defaultValue: string;
  isWeb: boolean;
  elementCopy: StepContentElement;
  private subscription: Subscription = new Subscription();

  constructor(
    private utilityService: SharedUtilityService,
    @Host() private _inputService: InputService,
    private orangeMoneyService: OrangeMoneyService,
    private currencyPipe: CurrencyPipe,
    private journeyService: JourneyService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();

    const currentJourney = this.journeyService.getCurrentJourney();
    if (this.journeyService.journeyServiceMap[currentJourney.journeyID]) {
      this.subscription.add(
        this.journeyService.journeyServiceMap[
          currentJourney.journeyID
        ].valueChange.subscribe(() => {
          const dbAnswer: string = this.getDBAnswer();
          this.setDefaultValue(dbAnswer);
        })
      );
    } else {
      const dbAnswer: string = this.getDBAnswer();
      this.setDefaultValue(dbAnswer);
    }
    this.isRequired.emit(this.element.isRequired);
    if (this.element.label) {
      this.element.label = this.utilityService.replaceCurrentYear(
        this.element.label
      );
    }
    if (this.value) {
      this.defaultValue = JSON.parse(JSON.stringify(this.value));
    }
    this.elementCopy = JSON.parse(JSON.stringify(this.element));
  }

  async setDefaultValue(dbAnswer: string): Promise<void> {
    if (this.prefill) {
      const prefillValue = this.values && this.values[this.element?.answerId];
      if (prefillValue || prefillValue === '') {
        this.value = prefillValue as string;
      } else if (dbAnswer || dbAnswer === '') {
        this.value = dbAnswer;
      } else if (this.element?.default) {
        this.value = this.element?.default.toString();
        if (this.element.answerId === 'grossYearIncome') {
          const salary = await this.orangeMoneyService.getSalary();
          this.value = this.currencyPipe.transform(
            salary,
            'USD',
            true,
            '1.2-2'
          );
        }
      }
      this.emitCurrentValue(false);
      this.emitValueChange(this.value);
    }
  }

  getDBAnswer(): string {
    return this.answer && JSON.parse(this.answer)[this.element?.answerId];
  }

  emitCurrentValue(emitBlur = true) {
    this.currentValue.emit(this.value);
    if (emitBlur) {
      this.blur.emit(this.value);
    }
  }

  emitValueChange(value: string) {
    this.value = value;
    this.valueChange.emit(this.value);
  }

  emitUpdateStepValueAndStep() {
    this.updateStepValueAndStep.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
