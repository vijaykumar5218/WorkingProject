import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  StepContentElement,
  Option,
} from '@shared-lib/services/journey/models/journey.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
@Component({
  selector: 'journeys-steps-step-input-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  @Input() element: StepContentElement;
  @Input() defaultValue: string;
  @Input() ariaLabel: string;
  @Output() valueChange = new EventEmitter<string>();
  value: Option;
  isWeb = false;
  content: JourneyContent = journeyContent;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    if (this.defaultValue) {
      this.value = JSON.parse(this.defaultValue);
    }
  }

  onChange(value: string | number) {
    this.value = this.element.options.find(opt => opt.value === value);
    this.valueChange.emit(JSON.stringify(this.value));
  }
}
