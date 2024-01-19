import {Component, Input} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {NotificationService} from '@shared-lib/services/notification/notification.service';
import {NotificationCount} from '@shared-lib/services/notification/models/notification.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {Badge, BadgePlugin} from '@capawesome/capacitor-badge';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() actionOption: ActionOptions;
  isAndroid: boolean;
  notificationValue: NotificationCount;
  private badge: BadgePlugin;
  private subscription = new Subscription();

  constructor(
    private baseService: BaseService,
    private notificationService: NotificationService
  ) {
    this.badge = Badge;
  }

  ngOnInit() {
    this.subscription.add(
      this.notificationService.getNotificationCount().subscribe(data => {
        this.notificationValue = data;
      })
    );
    this.notificationService.initializeNotificationCount();
  }

  routeToPage(str: string, clear = false) {
    if (clear) {
      this.badge.clear();
      this.notificationValue.newNotificationCount = 0;
    }

    if (str === 'back') {
      this.baseService.navigateBack();
    } else {
      this.baseService.navigateByUrl(str);
    }
  }

  ngOnDestroy() {
    this.notificationService.clearCountInterval();
    this.subscription.unsubscribe();
  }
}
