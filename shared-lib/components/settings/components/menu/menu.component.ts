import {Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {HelpService} from '@shared-lib/services/help/help.service';
import {Router} from '@angular/router';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  MenuConfig,
  MenuConfigItems,
  MenuOptions,
} from './model/menuConfig.model';
import * as settingsOption from './constants/menuOptions.json';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {QualtricsProperty} from '@shared-lib/services/qualtrics/constants/qualtrics-properties.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {MXAccountRootObject} from '@shared-lib/services/mx-service/models/mx.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuComponent {
  settingsOption: MenuOptions = settingsOption;
  isWeb: boolean;
  isDesktop: boolean;
  @Input() selectedTab: string;
  @Input() config: MenuConfig;
  @Input() isHelp: boolean;
  subscription: Subscription;
  @Output() menuClick: EventEmitter<void> = new EventEmitter();

  constructor(
    private router: Router,
    private helpService: HelpService,
    private inAppBrowserService: InAppBroserService,
    private mxService: MXService,
    private qualtricsService: QualtricsService,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  ngOnInit(): void {
    this.subscription = this.mxService
      .getMxAccountConnect()
      .subscribe(mxAccountsData => {
        this.processMxAccData(mxAccountsData);
      });
  }

  async processMxAccData(mxAccountsData: MXAccountRootObject) {
    await this.waitForConfig();
    if (mxAccountsData.accounts.length < 1) {
      const id = this.settingsOption.manageAcctsId;
      this.config.items = this.config.items.filter(value => {
        return value.id != id;
      });
    }
  }

  waitForConfig(): Promise<void> {
    const poll = async resolve => {
      if (this.config.items.length > 0) {
        resolve();
      } else {
        setTimeout(() => {
          poll(resolve);
        }, 50);
      }
    };
    return new Promise(poll);
  }

  async navigateTo(item: MenuConfigItems): Promise<void> {
    this.menuClick.emit();
    if (item.id === this.settingsOption.feedbackId) {
      if (this.isWeb) {
        this.router.navigateByUrl(item.route);
      }
      await this.qualtricsService.setProperty(
        QualtricsProperty.FEEDBACK,
        'true'
      );
      await this.qualtricsService.evaluateInterceptId(
        QualtricsIntercept.FEEDBACK_INTERCEPT,
        true
      );
      this.qualtricsService.setProperty(QualtricsProperty.FEEDBACK, 'false');
    } else if (item.id === this.settingsOption.termsId) {
      if (!this.isWeb) {
        this.inAppBrowserService.openInAppBrowser(
          this.settingsOption.TCUrl,
          new VoyaIABController()
        );
      } else {
        window.open(this.settingsOption.TCUrl, '_blank');
      }
    } else {
      this.router.navigateByUrl(item.route);
      if (this.isHelp) {
        this.helpService.setCategoryData(item.category);
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
