import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {
  Option,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '../../../../../../../services/journey/journey.service';

@Component({
  selector: 'journeys-steps-step-input-icon-text-button-select',
  templateUrl: './icon-text-button-select.component.html',
  styleUrls: ['./icon-text-button-select.component.scss'],
})
export class IconTextButtonSelectComponent implements OnInit {
  @Input() element: StepContentElement;
  @Input() defaultValue: string;
  @Input() index: number;
  @Output() valueChange = new EventEmitter<string>();
  @Output() updateStepValueAndStep = new EventEmitter<void>();
  private value: Record<string, string | number>;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    const value = this.journeyService.safeParse(this.defaultValue) as Record<
      string,
      string
    >;
    this.element.options.forEach(element => {
      if (element.id === value?.id) {
        element.checked = true;
      }
    });
  }

  chooseDependent(option: Option) {
    let optionSelected = false;
    this.element.options.forEach(element => {
      if (element === option && !option.checked) {
        optionSelected = true;
        this.value = {
          id: option.id,
          label: option.label,
          value: option.value,
        };
        this.valueChange.emit(JSON.stringify(this.value));
        option.checked = !option.checked;
      } else {
        element.checked = false;
      }
    });
    if (!optionSelected) {
      this.valueChange.emit(undefined);
    }
  }

  emitUpdateStepValueAndStep() {
    this.updateStepValueAndStep.emit();
  }
}
