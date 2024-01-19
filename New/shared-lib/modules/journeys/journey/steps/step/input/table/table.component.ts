import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

interface TableInputValue {
  answerId: string;
  value: string;
}

@Component({
  selector: 'journeys-steps-step-input-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() element: StepContentElement;
  @Output() inputChange = new EventEmitter<string>();
  private values: TableInputValue[] = [];
  @Input() defaultValue: string;
  isWeb: boolean;
  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    if (this.defaultValue) {
      this.values = JSON.parse(this.defaultValue);
    }
  }

  emitValueChange(value: string, answerId: string) {
    const currentAnswer = this.getValByAnswerId(answerId);
    if (currentAnswer) {
      currentAnswer.value = value;
    } else {
      this.values.push({answerId: answerId, value: value});
    }
    this.inputChange.emit(JSON.stringify(this.values));
  }

  getValByAnswerId(answerId: string): TableInputValue {
    return this.values.filter(val => val.answerId === answerId)[0];
  }
}
