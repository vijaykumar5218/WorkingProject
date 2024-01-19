import {Component, OnDestroy} from '@angular/core';
import {SettingsContent} from '@shared-lib/services/notification-setting/models/notification-settings-content.model';
import {PartyIds} from '@shared-lib/services/notification-setting/models/party-ids.model';
import * as commonContent from '@shared-lib/services/notification-setting/constants/common-content.json';
import {NotificationsSettingService} from '@shared-lib/services/notification-setting/notification-setting.service';
import {LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderFooterTypeService} from '../../../../services/header-footer-type/headerFooterType.service';
import {ActionOptions} from '../../../../models/ActionOptions.model';
import {HeaderType} from '../../../../constants/headerType.enum';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingConstants} from '@shared-lib/services/event-tracker/models/event-tracking.model';
import * as eventC from '@shared-lib/services/event-tracker/constants/event-tracking.json';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
})
export class NotificationSettingsPage implements OnDestroy {
  content = (commonContent as any).default;
  actionOption: ActionOptions = {
    headername: this.content.headername,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: 'settings',
    },
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  isWeb: boolean;
  isDesktop: boolean;
  settingsHeader: string;
  settingsFooter: string;
  partyIdVals: PartyIds;
  settingsContent: SettingsContent;
  subscription = new Subscription();
  savePath = '/settings';
  eventContent: EventTrackingConstants = eventC;

  constructor(
    private headerFooterType: HeaderFooterTypeService,
    private settingService: NotificationsSettingService,
    private loadingController: LoadingController,
    private router: Router,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService,
    private journeyService: JourneyService,
    private eventTrackingService: EventTrackingService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ngOnInit() {
    this.initData();
  }

  async ionViewWillEnter() {
    const backLink = this.journeyService.getJourneyBackButton();
    if (backLink) {
      this.actionOption.buttonLeft.link = backLink;
      this.savePath = backLink;
    } else {
      this.actionOption.buttonLeft.link = 'settings';
      this.savePath = '/settings';
    }
    this.headerFooterType.publishType(
      {
        type: HeaderType.navbar,
        actionOption: this.actionOption,
      },
      {type: FooterType.tabsnav, selectedTab: 'settings'}
    );
    this.journeyService.setJourneyBackButton(undefined);
  }

  async initData() {
    this.settingsContent = await this.settingService.getSettingsContent();
    this.settingService.setPrefsSettings();
  }

  async saveSettings(): Promise<void> {
    const loading = await this.loadingController.create({
      translucent: true,
    });
    await loading.present();

    await this.settingService.saveNotificationPrefs();
    this.trackNotificationPreferenceUpdate();
    this.settingService.getNotificationSettings(true);
    const rootPath = this.isWeb && !this.isDesktop ? 'more' : this.savePath;
    this.router.navigateByUrl(rootPath);
    loading.dismiss();
  }

  undoSettings() {
    this.settingService.prefSettingsInitialized = false;
    this.settingService.setPrefsSettings();
    this.router.navigateByUrl(this.savePath);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackNotificationPreferenceUpdate() {
    this.eventTrackingService.eventTracking({
      eventName: this.eventContent.eventTrackingPreference.eventName,
    });
  }
}
