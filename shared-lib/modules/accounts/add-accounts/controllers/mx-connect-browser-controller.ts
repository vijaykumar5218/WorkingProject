import {InAppBrowserEvent} from '@ionic-native/in-app-browser';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';

export class MXConnectBrowserController extends VoyaIABController {
  showLoader = false;

  async loadStartCallback(event?: InAppBrowserEvent): Promise<void> {
    super.loadStartCallback();

    if (event.url.includes('com.voya.edt.myvoyage')) {
      this.browser.close();
    }
  }
}
