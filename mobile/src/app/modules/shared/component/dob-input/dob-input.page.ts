import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as pageContent from '@shared-lib/constants/RequestPin.json';
import {InputData} from '../../service/loading-service/models/inputFiled-data';

@Component({
  selector: 'app-dob-input',
  templateUrl: './dob-input.page.html',
  styleUrls: ['./dob-input.page.scss'],
})
export class DobInputPage implements OnInit {
  childData = '';
  @Input() submitted = false;
  @Output() dobEvent: EventEmitter<InputData> = new EventEmitter();
  dobLabel = false;
  dob: boolean;
  link: boolean;
  dobChange: boolean;
  @Input() labelBool: boolean;
  selectedDate = '';
  dobString = '';
  @Input() timePeriod: boolean;
  @Input() dateSelector: boolean;
  myDate = '';
  maxDate: string = new Date(
    new Date().setDate(new Date().getFullYear() + 20)
  ).toISOString();
  pageText: any = JSON.parse(JSON.stringify(pageContent)).default;
  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.dateSelector) {
      this.myDate = new Date(
        new Date().setDate(new Date().getDate() + 10)
      ).toISOString();
    }
  }

  requestPin() {
    this.router.navigateByUrl('/login/register-ssn-eid/request-new-pin');
  }

  reset() {
    this.myDate = '';
  }

  sendData(str, status) {
    const res: InputData = {
      value: str,
      status: status,
    };
    this.dobEvent.emit(res);
  }

  dateSelected(event) {
    this.dobLabel = this.labelBool;
    this.sendData(event.detail.value, true);
    this.selectedDate = event.detail.value;
  }
}
