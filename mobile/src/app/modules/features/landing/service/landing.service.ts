import {Injectable, OnDestroy} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from '../constants/endpoints';
import {AccessResult} from '@shared-lib/services/access/models/access.model';
import {
  AllLaunchContent,
  LaunchContent,
  NoAccessMessage,
} from '../models/landing.model';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {VoyaIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/voya-iab-controller';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AccessService} from '@shared-lib/services/access/access.service';
import {AttestationService} from '../../../shared/service/attestation/attestation.service';
import {AlertWindowService} from '../../../shared/service/alert-window/alert-window.service';
import {version} from '../constants/version';
import {Subscription} from 'rxjs';
import {PlatformService} from '../../../shared/service/platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class LandingService implements OnDestroy {
  endPoints = endPoints;
  private allLaunchContentPromise: Promise<AllLaunchContent>;
  private resumeSubscription: Subscription;
  private closed = true;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private inAppBrowser: InAppBroserService,
    private accessService: AccessService,
    private attestationService: AttestationService,
    private alertWindowService: AlertWindowService,
    private platformService: PlatformService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  navigateByUrl(link: string) {
    this.baseService.navigateByUrl(link);
  }

  async getAllLaunchContent(refresh = false): Promise<AllLaunchContent> {
    if (!this.allLaunchContentPromise || refresh) {
      this.allLaunchContentPromise = this.baseService.get(
        this.endPoints.landingContent,
        false
      );
    }
    return this.allLaunchContentPromise;
  }

  async getLandingContent(): Promise<LaunchContent> {
    const result = await this.getAllLaunchContent();
    return JSON.parse(result.loginJSON);
  }

  async getNoAccessMessage(): Promise<NoAccessMessage> {
    const result = await this.getAllLaunchContent();
    return JSON.parse(result.LoginNoAccessMessage);
  }

  openInBrowser(url: string) {
    this.inAppBrowser.openInAppBrowser(url, new VoyaIABController());
  }

  async checkMyvoyageAccess(): Promise<AccessResult> {
    return this.accessService.checkMyvoyageAccess(true);
  }

  validateApplication(): Promise<boolean> {
    return this.attestationService.attestApplication();
  }

  async openVersionAlert() {
    this.openAlert();
    if (!this.resumeSubscription) {
      this.resumeSubscription = this.platformService.onResume$.subscribe(() => {
        this.openAlert();
      });
    }
  }

  private async openAlert() {
    const appVersionContent = JSON.parse(
      (await this.getAllLaunchContent(true)).AppVersionJSON
    );
    if (version < appVersionContent.minVersion && this.closed) {
      this.closed = false;
      this.alertWindowService.presentAlert({
        cssClass: 'version-alert',
        message: appVersionContent.alertText,
        header: ' ',
        backdropDismiss: false,
        buttons: [
          {
            text: appVersionContent.downloadText,
            handler: () => {
              this.closed = true;
              const appUrl = this.platformService.isIos()
                ? appVersionContent.iosAppUrl
                : appVersionContent.androidAppUrl;

              window.open(appUrl);
            },
          },
        ],
      });
    }
  }

  ngOnDestroy() {
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
  }
}
