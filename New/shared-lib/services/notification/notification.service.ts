import {Injectable} from '@angular/core';
import {endPoints} from './constants/endpoints';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {NotificationCount, Notification} from './models/notification.model';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  endPoints = endPoints;
  notificationCountSubject = new ReplaySubject<NotificationCount>(1);
  private pageVisitPromise: Promise<void>;
  private interval: NodeJS.Timeout;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async getNotification(): Promise<Notification> {
    return this.baseService.get(this.endPoints.notificationDetails);
  }

  savePageVisit(): Promise<void> {
    this.pageVisitPromise = this.baseService.post(
      this.endPoints.savePageVisit,
      {
        pageName: 'BELL',
        actionPerformed: 'VISITED',
      }
    );
    return this.pageVisitPromise;
  }

  initializeNotificationCount() {
    this.getCount();
    this.interval = setInterval(async () => {
      this.getCount();
    }, 60000);
  }

  private async getCount() {
    if (this.pageVisitPromise) {
      await this.pageVisitPromise;
    }
    const count = await this.baseService.get(this.endPoints.notificationCount);
    this.notificationCountSubject.next(count);
  }

  getNotificationCount(): Observable<NotificationCount> {
    return this.notificationCountSubject;
  }

  clearCountInterval() {
    clearInterval(this.interval);
  }
}
