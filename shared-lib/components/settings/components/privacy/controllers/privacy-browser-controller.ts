import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';

export class PrivacyBrowserController extends VoyaIABController {
  async loadStopCallback(): Promise<void> {
    super.loadStopCallback();

    this.browser.insertCSS({
      code:
        '.v-simpleTable { margin-right: 0px !important; margin-left: 0px !important; }',
    });
  }
}
