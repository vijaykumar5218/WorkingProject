import {Injectable} from '@angular/core';
import { SettingsDisplayFlags} from './models/settings.model';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endpoints} from './constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private endpoints;
  private displayFlag: SettingsDisplayFlags;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
  }

  async getSettingsDisplayFlags(
    refresh = false
  ): Promise<SettingsDisplayFlags> {
    try {
      if (!this.displayFlag || refresh) {
        this.displayFlag = await this.baseService.get(
          this.endpoints.settingsDisplayFlags
        );
      }
    } catch (e) {
      console.log(e);
      this.displayFlag = {
        displayContactLink: false,
        suppressAppointment: false,
      };
    }
    return this.displayFlag;
  }
}
