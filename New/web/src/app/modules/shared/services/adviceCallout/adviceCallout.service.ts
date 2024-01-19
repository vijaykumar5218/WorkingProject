import {Injectable} from '@angular/core';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {endPoints} from './constants/endpoints';
import {OfferCode} from './model/OfferCode.model';

@Injectable({
  providedIn: 'root',
})
export class AdviceCalloutService {
  private endpoints = endPoints;
  private offercodes: OfferCode[];
  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private accessService: AccessService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async getAdviceCallout(): Promise<OfferCode[]> {
    if (!this.offercodes) {
      const sessionID = await this.accessService.getSessionId();
      await this.baseService
        .get(this.endpoints.adviceCallout + sessionID)
        .then((res: OfferCode[]) => {
          this.offercodes = res.filter(
            (offercode, index) =>
              offercode.offerCode &&
              (offercode.offerCode == 'MANACCT' ||
                offercode.offerCode == 'MANACTIPS' ||
                offercode.offerCode == 'FE') &&
              index < 1
          );
        });
    }
    return this.offercodes;
  }
}
