import {DefaultIABController} from './default-iab-controller';
import content from '@shared-lib/services/benefits/open-savvi/constants/benefits.json';
import {InAppBroserService} from '../in-app-browser.service';
import {IABMessage} from '../constants/message.enum';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';

export class SavviIABController extends DefaultIABController {
  private openSavviService: OpenSavviService;
  private inAppBrowser: InAppBroserService;

  constructor(
    inAppBrowser: InAppBroserService,
    openSavviService: OpenSavviService
  ) {
    super();
    this.inAppBrowser = inAppBrowser;
    this.showLoader = false;
    this.openSavviService = openSavviService;
  }

  async loadStopCallback() {
    this.browser.insertCSS({
      code: `
          #root {
            margin-top: 64px;
          }`,
    });
    this.displayCustomHeader(content.headerText, true, false);

    const script = `
      document.addEventListener('signOutComplete', () => {
        webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: '${IABMessage.close}'}));
      });
      window.savvi = {isMobile: true};
      window.dispatchEvent(new CustomEvent('savvi.ismobile'));
    `;
    this.browser.executeScript({code: script});

    super.loadStopCallback();
    this.loadingController.dismiss();
  }

  async openInAppBrowser(savviUrl: string) {
    this.inAppBrowser.openInAppBrowser(savviUrl, this);
  }

  exitCallback() {
    this.openSavviService.exitCallback();
  }

  resumeCallback() {
    return;
  }
}
