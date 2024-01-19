import {Injectable} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from '../constants/endpoints';
import {LogoutContent} from '../models/logout.model';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  endPoints = endPoints;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async getLogoutContent(): Promise<LogoutContent> {
    const result = await this.baseService.get(
      this.endPoints.logoutContent,
      false
    );
    return JSON.parse(result.SessionTimeoutContent);
  }
}
