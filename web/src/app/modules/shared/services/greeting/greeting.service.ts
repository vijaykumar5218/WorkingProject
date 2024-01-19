import {Injectable} from '@angular/core';
import * as moment from 'moment';
import * as PageText from '@web/app/modules/features/workplace-dashboard/home/constants/workplace-dashboard-content.json';
import {MVlandingContent} from '@web/app/modules/features/workplace-dashboard/home/models/mvlandingcontent.model';

@Injectable({
  providedIn: 'root',
})
export class GreetingService {
  isMorning: boolean;
  isEvening: boolean;
  pageText: MVlandingContent = (PageText as any).default;

  constructor() {
    this.initialize();
  }

  initialize() {
    const localTime = this.getLocaltime();
    if (localTime < this.pageText.morningTimeCondition) {
      this.manageTimingFlag(true, false);
    } else if (localTime > this.pageText.eveningTimeCondition) {
      this.manageTimingFlag(false, true);
    } else {
      this.manageTimingFlag(false, false);
    }
  }

  manageTimingFlag(isMorningFlag: boolean, isEveningFlag: boolean) {
    this.isMorning = isMorningFlag;
    this.isEvening = isEveningFlag;
  }

  getLocaltime(): string {
    return moment().format('HH');
  }

  getIsMorningFlag() {
    return this.isMorning;
  }

  getIsEveningFlag() {
    return this.isEvening;
  }
}
