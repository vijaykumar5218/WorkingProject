import {Injectable} from '@angular/core';
import {PushNotificationsService} from '@shared-lib/services/pushNotifications/pushNotifications.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';
import {EventTrackingConstants} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {GoogleAnalyticsService} from '../google-Analytics/google.analytics.service';
import {NotificationsSettingService} from '../notification-setting/notification-setting.service';
import {AccessService} from '../access/access.service';
import {ModalController} from '@ionic/angular';
import {PreferenceSelectionPage} from '@shared-lib/modules/preferences-selection/preferences-selection.page';
import {SharedUtilityService} from '../utility/utility.service';
import {ModalPresentationService} from '../modal-presentation/modal-presentation.service';
import {firstValueFrom} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  eventContent: EventTrackingConstants = eventC;
  private contactKeySet = false;
  private stayUpToDateSeen = false;

  constructor(
    private pushNotificationsService: PushNotificationsService,
    private eventTrackingService: EventTrackingService,
    private qualtricsService: QualtricsService,
    private accountService: AccountService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private settingsService: NotificationsSettingService,
    private modalController: ModalController,
    private accessService: AccessService,
    private utilityService: SharedUtilityService,
    private modalPresentationService: ModalPresentationService
  ) {}

  private trackHomeEvent() {
    this.eventTrackingService.eventTracking({
      eventName: this.eventContent.eventTrackingLogin.eventName,
    });
  }

  private async setSFMCContactKey() {
    if (!this.contactKeySet) {
      this.contactKeySet = true;
      const subscriberKeyInfo = await this.eventTrackingService.getSubscriberKey();
      this.pushNotificationsService.setContactKey(
        subscriberKeyInfo.subscriberKey
      );
    }
  }

  private setQualtricsProps() {
    this.accountService.getParticipant().subscribe((data: Participant) => {
      this.qualtricsService.setUserProperties(data);
    });
  }

  async getPartyId() {
    const result = await this.googleAnalyticsService.getQualtricsUser();
    return result?.partyId;
  }

  async getEmail() {
    const result = await firstValueFrom(
      this.settingsService.getNotificationSettings()
    );
    return result?.primaryEmail?.email;
  }

  initializeAppForUser() {
    this.setSFMCContactKey();
    this.setQualtricsProps();
    this.trackHomeEvent();
  }
  async openPreferenceSettingModal() {
    const myvoyageAccessResult = await this.accessService.checkMyvoyageAccess();
    if (
      myvoyageAccessResult &&
      myvoyageAccessResult.enableMyVoyage === 'Y' &&
      !this.getStayUpToDateSeen()
    ) {
      this.setStayUpToDateSeen(true);
      const lastPreferenceValues = await this.accessService.checkLastPreferenceUpdated();
      if (
        (myvoyageAccessResult.firstTimeLogin &&
          myvoyageAccessResult.firstTimeLoginWeb) ||
        (lastPreferenceValues.lastPreferenceResponse &&
          !('insightsNotificationPrefs' in lastPreferenceValues) &&
          !('highPrioitytNotificationPrefs' in lastPreferenceValues) &&
          !('accountAlertPrefs' in lastPreferenceValues))
      ) {
        const preferenceClass = this.utilityService.getIsWeb()
          ? 'modal-scroll-fullscreen'
          : 'modal-fullscreen';
        const modal = await this.modalController.create({
          component: PreferenceSelectionPage,
          componentProps: {
            preferenceObject: lastPreferenceValues,
            loginObject: myvoyageAccessResult,
          },
          cssClass: preferenceClass,
        });
        this.modalPresentationService.present(modal);
      }
    }
  }

  private setStayUpToDateSeen(seen: boolean) {
    this.stayUpToDateSeen = seen;
    localStorage.setItem('stayUpToDateSeen', JSON.stringify(seen));
  }

  private getStayUpToDateSeen(): boolean {
    if (this.stayUpToDateSeen === undefined) {
      this.stayUpToDateSeen = JSON.parse(
        localStorage.getItem('stayUpToDateSeen') || 'false'
      );
    }
    return this.stayUpToDateSeen;
  }
}
