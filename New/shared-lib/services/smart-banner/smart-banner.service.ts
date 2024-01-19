import {Injectable} from '@angular/core';
import {BaseService} from '../base/base-factory-provider';
import {endpoints} from '../smart-banner/constants/smart-banner-endpoints';
import {SmartBannerOptions} from './models/smart-banner.model';
import {Environment} from '@shared-lib/models/environment.model';
import {SharedUtilityService} from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class SmartBannerService {
  environment: Environment;
  smartBannerOptions: SmartBannerOptions;
  endPoints = endpoints;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.environment = this.utilityService.getEnvironment();
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(
      endpoints,
      this.environment.loginBaseUrl
    );
  }

  async getSmartBannerOptions(): Promise<SmartBannerOptions> {
    if (!this.smartBannerOptions) {
      const result = await this.baseService.get(
        this.endPoints.getSmartbannerOptions
      );
      this.smartBannerOptions = JSON.parse(result.MyVoyageBannerJSON);
      this.smartBannerOptions.icon =
        this.environment.loginBaseUrl + this.smartBannerOptions.icon;
    }
    return this.smartBannerOptions;
  }
}
