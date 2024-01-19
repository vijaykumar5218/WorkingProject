import {Injectable} from '@angular/core';
import {endPoints} from '@shared-lib/services/account/constants/endpoints';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventTrackingEvent, SFMCUserInfo} from './models/event-tracking.model';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class EventTrackingService {
  endPoints = endPoints;
  private subscriberKeyPromise: Promise<SFMCUserInfo>;
  private authChangeSubscription: Subscription;
  private biometricChangeSubscription: Subscription;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private authService: AuthenticationService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async eventTracking(postData: EventTrackingEvent): Promise<void> {
    postData.createdBy = 'myvoyage';
    postData.subscriberKey = (await this.getSubscriberKey()).subscriberKey;
    postData.passThruAttributes = [
      ...(postData.passThruAttributes || []),
      {
        attributeName: 'platform',
        attributeValue: this.utilityService.getIsWeb() ? 'web' : 'mobile',
      },
    ];
    await this.baseService.post(this.endPoints.eventTracking, postData);
  }

  async eventTrackingAfterAuthorized(eventTrackingEvent: EventTrackingEvent) {
    if (this.authChangeSubscription) {
      this.authChangeSubscription.unsubscribe();
    }
    if (this.biometricChangeSubscription) {
      this.biometricChangeSubscription.unsubscribe();
    }
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      this.eventTracking(eventTrackingEvent);
    } else {
      this.authChangeSubscription = this.authService.authenticationChange$.subscribe(
        isAuthenticated => {
          if (isAuthenticated.auth && isAuthenticated.attested) {
            this.sendEventAndUnsubscribe(eventTrackingEvent);
          }
        }
      );
      this.biometricChangeSubscription = this.authService.biometricsAuthenticationChange$.subscribe(
        isAuth => {
          if (isAuth) {
            this.sendEventAndUnsubscribe(eventTrackingEvent);
          }
        }
      );
    }
  }

  private sendEventAndUnsubscribe(eventTrackingEvent: EventTrackingEvent) {
    this.eventTracking(eventTrackingEvent);
    this.authChangeSubscription.unsubscribe();
    this.authChangeSubscription = undefined;
    this.biometricChangeSubscription.unsubscribe();
    this.biometricChangeSubscription = undefined;
  }

  getSubscriberKey(): Promise<SFMCUserInfo> {
    if (!this.subscriberKeyPromise) {
      this.subscriberKeyPromise = this.baseService.get(
        this.endPoints.subscriberKey
      );
    }
    return this.subscriberKeyPromise;
  }
}
