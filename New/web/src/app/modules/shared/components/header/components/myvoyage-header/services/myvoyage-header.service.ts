import {NotificationService} from '@shared-lib/services/notification/notification.service';
import {HelpService} from '@shared-lib/services/help/help.service';
import {Category} from '@shared-lib/services/help/models/help.model';
import {NotificationCount} from '@shared-lib/services/notification/models/notification.model';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MyVoyageHeaderService {
  constructor(
    private helpService: HelpService,
    private notificationService: NotificationService
  ) {}

  getNotificationCount(): Observable<NotificationCount> {
    return this.notificationService.getNotificationCount();
  }

  initializeNotificationCount() {
    this.notificationService.initializeNotificationCount();
  }

  clearCountInterval() {
    this.notificationService.clearCountInterval();
  }

  getCategoryData(): Category {
    return this.helpService.getCategoryData();
  }
}
