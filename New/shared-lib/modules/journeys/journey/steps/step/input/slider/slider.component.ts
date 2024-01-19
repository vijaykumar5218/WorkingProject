import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SkipSelf,
} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Subscription} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {InputService} from '../service/input.service';

@Component({
  selector: 'journeys-steps-step-input-slider',
  templateUrl: './slider.component.html',
  styleUrls: [
    './slider.component.scss',
    '../../../../../../../scss/button.scss',
  ],
})
export class SliderComponent implements OnInit {
  @Input() element: StepContentElement;
  @Input() defaultValue: string;
  value: string;
  max: number;
  service: any;
  private subscription = new Subscription();
  private answer: Record<number, string> = {};
  sliderValue: number;
  @Output() valueChange = new EventEmitter<string>();

  constructor(
    private journeyService: JourneyService,
    @SkipSelf() private inputService: InputService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
  }

  ngOnInit() {
    this.subscription.add(
      this.service.valueChange.subscribe(() => {
        if (this.element.validationRules.maxId) {
          const newMax = this.service[this.element.validationRules.maxId];
          if (newMax !== this.max) {
            this.max = newMax;
            this.sliderValue = newMax;
            const rules = Object.assign({}, this.element.validationRules);
            rules.max = newMax;
            this.inputService.publishValidationRules(rules);
          }
        } else {
          this.max = this.element.validationRules.max;
        }
        const parsedDefault = this.journeyService.safeParse(this.defaultValue);
        let defaultValue = parsedDefault && parsedDefault[this.max];
        if (!defaultValue && !this.answer[this.max]) {
          defaultValue = this.journeyService.addDollar(
            this.service[this.element.defaultId]?.toString(),
            this.element
          );
        } else if (!defaultValue) {
          defaultValue = this.answer[this.max];
        }

        this.updateValueAndAnswer(defaultValue);
        this.sliderValue = parseFloat(
          this.journeyService.removeDollar(this.value, this.element)
        );
      })
    );
  }

  onInputBlur(value: string) {
    this.updateValueAndAnswer(value, false);
    this.sliderValue = parseFloat(
      this.journeyService.removeDollar(this.value, this.element)
    );
  }

  onSliderChange(
    value:
      | number
      | {
          lower: number;
          upper: number;
        }
  ) {
    if (value && typeof value === 'number') {
      this.updateValueAndAnswer(
        this.journeyService.addDollar(this.sliderValue.toString(), this.element)
      );
      this.callChangeFunction();
    }
  }

  private callChangeFunction() {
    this.service?.onChange(this.sliderValue);
  }

  updateValueAndAnswer(value: string, detectChanges = true) {
    if (value !== this.value) {
      this.value = value;
      if (detectChanges) {
        this.changeDetectorRef.detectChanges();
      }
    }
    if (this.answer[this.max]) {
      this.answer[this.max] = this.value;
    } else {
      this.answer = {};
      this.answer[this.max] = this.value;
    }
    this.valueChange.emit(JSON.stringify(this.answer));
  }

  reset() {
    const resetValue =
      typeof this.service.reset === 'function'
        ? this.service.reset()
        : this.max;
    this.updateValueAndAnswer(
      this.journeyService.addDollar(resetValue.toString(), this.element),
      false
    );
    this.sliderValue = resetValue;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
