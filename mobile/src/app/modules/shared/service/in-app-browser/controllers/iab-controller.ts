import {
  InAppBrowserEvent,
  InAppBrowserObject,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser';
import {LoadingController} from '@ionic/angular';

export interface IABController {
  browser: InAppBrowserObject;
  loadingController: LoadingController;
  browserOptions: InAppBrowserOptions;
  cordovaInApp: any;

  beforeLoadCallback?(event?: InAppBrowserEvent);
  loadStartCallback?(event?: InAppBrowserEvent);
  loadStopCallback?(event?: InAppBrowserEvent);
  exitCallback?(event?: InAppBrowserEvent);
  messageCallback?(event?: InAppBrowserEvent);
  displayCustomHeader(headerText?: string);
  resumeCallback?();
}
