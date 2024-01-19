import {Injectable} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {
  loginEndPoints,
  tokenEndPoints,
} from '@shared-lib/services/benefits/constants/endpoints';
import {Environment} from '@shared-lib/models/environment.model';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {QueryAccessToken} from '@shared-lib/services/benefits/open-savvi/models/queryAccessToken.model';
import {LoadingController} from '@ionic/angular';
import {BenefitsService} from '../benefits.service';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {SavviIABController} from '@mobile/app/modules/shared/service/in-app-browser/controllers/savvi-iab-controller';

@Injectable({
  providedIn: 'root',
})
export class OpenSavviService {
  public environment: Environment;
  public tokenEndPoints = tokenEndPoints;
  public loginEndPoints = loginEndPoints;

  constructor(
    private authService: AuthenticationService,
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private loadingController: LoadingController,
    private benefitsService: BenefitsService,
    private inAppBrowser: InAppBroserService
  ) {
    this.environment = this.utilityService.getEnvironment();
    this.tokenEndPoints = this.utilityService.appendBaseUrlToEndpoints(
      tokenEndPoints,
      this.environment.tokenBaseUrl
    );
    this.loginEndPoints = this.utilityService.appendBaseUrlToEndpoints(
      loginEndPoints,
      this.environment.loginBaseUrl
    );
  }

  async openSavvi() {
    new SavviIABController(this.inAppBrowser, this).openInAppBrowser(
      await this.generateSavviUrl()
    );
  }

  async generateSavviUrl(): Promise<string> {
    this.loginEndPoints.savviSaml = this.loginEndPoints.savviSaml.replace(
      '{savviBaseUrl}',
      this.environment.savviBaseUrl
    );
    if (!this.utilityService.getIsWeb()) {
      const loading = await this.loadingController.create({
        translucent: true,
      });
      await loading.present();
      const authToken = await this.authService.getAccessToken();
      const request = {
        client_id: this.environment.authTokenExchangeClient,
        subject_token: authToken,
        subject_token_type: 'access_token',
        audience: this.environment.ssoSamlUrl,
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        requested_token_type: 'access_token',
        scope: 'urn:voya:federation',
      };
      const queryAuthTokenResponse: QueryAccessToken = await this.baseService.postUrlEncoded(
        this.tokenEndPoints.samlAuthToken,
        request,
        {}
      );
      return (
        this.loginEndPoints.savviSaml + queryAuthTokenResponse.access_token
      );
    } else {
      return this.loginEndPoints.savviSaml;
    }
  }

  exitCallback() {
    this.benefitsService.resetBenefitsEnrollment();
    this.benefitsService.getBenefitsEnrollment();
  }
}
