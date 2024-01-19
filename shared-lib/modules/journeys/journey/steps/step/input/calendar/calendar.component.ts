import {formatDate} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import * as moment from 'moment';

@Component({
  selector: 'journeys-steps-step-input-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @Input() input: StepContentElement;
  @Input() placeholder: string;
  fullDateValue;

  ngOnInit(): void {
    const mo = moment(this.value);
    this.fullDateValue = mo.format('YYYY-MM-DD');
  }

  emitValueChange(event: CustomEvent) {
    const val = formatDate(event.detail.value, 'YYYY-MM', 'en-US');
    this.valueChange.emit(val);
  }
}
