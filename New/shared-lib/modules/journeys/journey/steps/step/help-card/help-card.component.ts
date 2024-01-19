import {Component, Input, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {SettingsDisplayFlags} from '@shared-lib/services/settings/models/settings.model';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {MoreDescription} from '@shared-lib/services/account-info/models/account-and-personal-info.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({
  selector: 'journeys-steps-step-help-card',
  templateUrl: './help-card.component.html',
  styleUrls: ['./help-card.component.scss'],
})
export class HelpCardComponent implements OnInit {
  @Input() element: StepContentElement;
  isWeb: boolean;
  moreContentSubscription = new Subscription();
  screenMessage: MoreDescription;
  settingsDisplayFlags: SettingsDisplayFlags;

  constructor(
    private journeyService: JourneyService,
    private utilityService: SharedUtilityService,
    private accountInfoService: AccountInfoService,
    private settingsService: SettingsService,
    private router: Router,
    private accountService: AccountService
  ) {}

  async ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.settingsDisplayFlags = await this.settingsService.getSettingsDisplayFlags();
  }

  async openWebView() {
    if ('videoUrl' in this.element) {
      this.journeyService.openModal({element: this.element});
    } else if (
      this.settingsDisplayFlags.displayContactLink &&
      !('externalLink' in this.element)
    ) {
      if (this.isWeb) {
        this.router.navigateByUrl('/journeys/contact-a-coach');
      } else {
        await this.fetchScreenContent();
        this.journeyService.openModal({
          element: {
            id: 'contactACoach',
          },
          screenMessage: this.screenMessage,
          settingsDisplayFlags: this.settingsDisplayFlags,
        });
      }
    } else if ('externalLink' in this.element) {
      window.open(this.element.externalLink, '_blank');
    } else {
      if (this.isWeb) {
        window.open(this.element.link, '_blank');
      } else {
        this.accountService.openPwebAccountLink(
          decodeURIComponent(this.element.link)
        );
      }
    }
  }

  fetchScreenContent(): Promise<void> {
    return new Promise(resolve => {
      this.moreContentSubscription.add(
        this.accountInfoService.getScreenMessage().subscribe(data => {
          this.screenMessage = data;
          if (this.settingsDisplayFlags.suppressAppointment) {
            this.screenMessage.TimetapURL = this.settingsDisplayFlags.pwebStatementUrl;
          }
          resolve();
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.moreContentSubscription.unsubscribe();
  }
}
