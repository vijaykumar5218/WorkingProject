import {Injectable} from '@angular/core';
import {AuthenticationService} from '../../../mobile/src/app/modules/shared/service/authentication/authentication.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import {SharedUtilityService} from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  private mcSDK: any;

  constructor(
    private authService: AuthenticationService,
    private eventTrackingService: EventTrackingService,
    private utilityService: SharedUtilityService
  ) {
    if (!this.utilityService.getIsWeb()) {
      this.mcSDK = window.MCCordovaPlugin;
      this.mcSDK.setOnNotificationOpenedListener(
        async (event: {values: {url: string}}) => {
          this.authService.didLaunchWithURL(event.values.url);
          this.captureCTAClickEvent(event.values.url);
        }
      );
    }
  }

  setContactKey(partyId: string) {
    this.mcSDK.setContactKey(partyId);
  }

  async captureCTAClickEvent(url: string) {
    const eventTrackingEvent: EventTrackingEvent = {
      eventName: 'CTAClick',
      passThruAttributes: [
        {
          attributeName: 'source',
          attributeValue: 'push',
        },
        {
          attributeName: 'redirect_url',
          attributeValue: url,
        },
      ],
    };
    this.eventTrackingService.eventTrackingAfterAuthorized(eventTrackingEvent);
  }
}
