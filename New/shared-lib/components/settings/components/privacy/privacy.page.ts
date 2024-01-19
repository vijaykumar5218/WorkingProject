import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Component} from '@angular/core';
import * as privacy from './constants/privacy.json';
import {PrivacyBrowserController} from './controllers/privacy-browser-controller';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
})
export class PrivacyPage {
  privacyText = JSON.parse(JSON.stringify(privacy)).default;
  actionOption: ActionOptions = {
    headername: 'Privacy',
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

  constructor(
    private headerType: HeaderTypeService,
    private inAppBrowserService: InAppBroserService,
    private sharedUtilityService: SharedUtilityService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  goToPrivacyWebView() {
    if (!this.isWeb) {
      this.inAppBrowserService.openInAppBrowser(
        this.privacyText.privacyNotice.url,
        new PrivacyBrowserController()
      );
    } else {
      window.open(this.privacyText.privacyNotice.url, '_blank');
    }
  }
}
