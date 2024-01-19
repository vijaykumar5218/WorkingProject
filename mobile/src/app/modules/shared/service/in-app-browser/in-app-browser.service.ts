import {Injectable, OnDestroy} from '@angular/core';
import {InAppBrowserOptions} from '@ionic-native/in-app-browser/ngx';
import {LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {PlatformService} from '../platform/platform.service';
import {IABController} from './controllers/iab-controller';

@Injectable({
  providedIn: 'root',
})
export class InAppBroserService implements OnDestroy {
  private window: any = <any>window;
  private cordovaInApp: any;
  private subscripton: Subscription;
  private browserOpen = false;

  constructor(
    private loader: LoadingController,
    private platformService: PlatformService
  ) {}

  getOptionsString(inAppBrowserOpts: InAppBrowserOptions) {
    const options: Array<any> = Object.keys(inAppBrowserOpts).map(key => {
      if (inAppBrowserOpts[key]) {
        return key + '=' + inAppBrowserOpts[key];
      } else {
        return null;
      }
    });
    const filtered = options.filter(function(el) {
      return el != null;
    });
    return filtered.join(',');
  }

  openSystemBrowser(url: string) {
    this.cordovaInApp = this.window.cordova.InAppBrowser;
    this.cordovaInApp.open(url, '_system');
  }

  openInAppBrowser(url: string, controller: IABController) {
    if (!this.browserOpen) {
      this.browserOpen = true;
      return this.openBrowser(url, controller);
    }
  }

  private openBrowser(url: string, controller: IABController) {
    this.cordovaInApp = this.window.cordova.InAppBrowser;

    const options = this.getOptionsString(controller.browserOptions);
    const browser = this.cordovaInApp.open(url, '_blank', options);
    controller.browser = browser;
    controller.loadingController = this.loader;
    controller.cordovaInApp = this.cordovaInApp;

    if (controller.browserOptions.beforeload && controller.beforeLoadCallback) {
      browser.addEventListener(
        'beforeload',
        controller.beforeLoadCallback.bind(controller)
      );
    }
    if (controller.loadStartCallback) {
      browser.addEventListener(
        'loadstart',
        controller.loadStartCallback.bind(controller)
      );
    }
    if (controller.loadStopCallback) {
      browser.addEventListener(
        'loadstop',
        controller.loadStopCallback.bind(controller)
      );
    }
    if (controller.messageCallback) {
      browser.addEventListener(
        'message',
        controller.messageCallback.bind(controller)
      );
    }
    if (controller.exitCallback) {
      browser.addEventListener(
        'exit',
        controller.exitCallback.bind(controller)
      );
    }
    browser.addEventListener('exit', this.handleExit.bind(this));

    this.unsubscribe();

    this.subscripton = this.platformService.onResume$.subscribe(async () => {
      if (controller.resumeCallback) {
        controller.resumeCallback();
      } else {
        this.browserOpen = false;
        this.openInAppBrowser(url, controller);
      }
    });

    return browser;
  }

  private handleExit() {
    this.browserOpen = false;
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.subscripton) {
      this.subscripton.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
