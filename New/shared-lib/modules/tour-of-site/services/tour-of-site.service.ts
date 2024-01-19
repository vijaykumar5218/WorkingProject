import {Injectable} from '@angular/core';
import {endPoints} from '../constants/endpoints';
import {SharedUtilityService} from '../../../services/utility/utility.service';
import {BaseService} from '../../../services/base/base-factory-provider';
import {TourOfSiteResponse} from '../models/tour-of-site-content.model';
import {Observable, from} from 'rxjs';
import {AccessService} from '../../../services/access/access.service';

@Injectable({
  providedIn: 'root',
})
export class TourOfSiteService {
  endPoints = endPoints;
  private tourOfSiteResponse: Observable<TourOfSiteResponse> = null;

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private accessService: AccessService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async getTourOfSite(): Promise<TourOfSiteResponse> {
    const sessionID = await this.accessService.getSessionId();
    return this.baseService.get(
      this.endPoints.tourOfSite.replace('{sessionID}', sessionID)
    );
  }

  getTourOfSiteData(): Observable<TourOfSiteResponse> {
    if (!this.tourOfSiteResponse) {
      this.tourOfSiteResponse = from(this.getTourOfSite());
    }
    return this.tourOfSiteResponse;
  }
}
