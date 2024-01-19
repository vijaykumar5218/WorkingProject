import {Component, Input} from '@angular/core';
import * as text from '../../constants/notification.json';
import {HighPriority} from '@shared-lib/services/notification/models/notification.model';
import {SharedUtilityService} from '../../../../services/utility/utility.service';
import {Router} from '@angular/router';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';
@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent {
  pageText: Record<string, string> = JSON.parse(JSON.stringify(text)).default;

  @Input() lastRow: boolean;
  @Input() notificationList: HighPriority[];
  isWeb: boolean;
  constructor(
    private utilityService: SharedUtilityService,
    private route: Router,
    private eventTrackingService: EventTrackingService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }
  handleNotificationUrlClick(notification: HighPriority) {
    const eventTrackingEvent: EventTrackingEvent = {
      eventName: 'CTAClick',
      passThruAttributes: [
        {
          attributeName: 'subType',
          attributeValue: notification.eventName,
        },
        {
          attributeName: 'redirect_route',
          attributeValue: notification.Link_url,
        },
      ],
    };
    this.eventTrackingService.eventTracking(eventTrackingEvent);
    this.route.navigateByUrl(notification.Link_url);
  }
}
