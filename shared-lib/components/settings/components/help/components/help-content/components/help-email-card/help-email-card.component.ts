import {Subscription} from 'rxjs';
import {Component, Input} from '@angular/core';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {
  HelpContent,
  HelpContentOption,
} from '@shared-lib/services/help/models/help.model';
import * as helpOption from '../../constants/helpContentOptions.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {QualtricsProperty} from '@shared-lib/services/qualtrics/constants/qualtrics-properties.enum';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {Router} from '@angular/router';
@Component({
  selector: 'app-help-email-card',
  templateUrl: './help-email-card.component.html',
  styleUrls: ['./help-email-card.component.scss'],
})
export class HelpEmailCardComponent {
  @Input() elementID: string;
  helpPageJSON: HelpContent;
  moreContentSubscription: Subscription;
  isWeb: boolean;

  constructor(
    private accountInfoService: AccountInfoService,
    private utilityService: SharedUtilityService,
    private qualtricsService: QualtricsService,
    private router: Router
  ) {}

  options: HelpContentOption = (helpOption as any).default;

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.moreContentSubscription = this.accountInfoService
      .getScreenMessage()
      .subscribe(data => {
        if (this.isWeb) {
          this.helpPageJSON = JSON.parse(data.DesktopHelpPageFAQs);
        } else {
          this.helpPageJSON = JSON.parse(data.HelpPageJSON);
        }
      });
  }

  async openQualtricsEmail() {
    if (!this.isWeb) {
      await this.qualtricsService.setProperty(
        QualtricsProperty.CONTACT_VOYA_SUPPORT,
        'true'
      );
      await this.qualtricsService.evaluateInterceptId(
        QualtricsIntercept.EMAIL_INTERCEPT,
        true
      );
      this.qualtricsService.setProperty(
        QualtricsProperty.CONTACT_VOYA_SUPPORT,
        'false'
      );
    }
  }

  ngOnDestroy(): void {
    this.moreContentSubscription.unsubscribe();
  }
}
