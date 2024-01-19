import {Injectable} from '@angular/core';
import {endPoints} from './constants/endpoints';
import {DisplayName} from './models/edit-display-name.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';

@Injectable({
  providedIn: 'root',
})
export class EditDisplayNameService {
  endPoints: any = endPoints;

  constructor(
    private utilityService: SharedUtilityService,
    private baseService: BaseService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  async saveDisplayName(displayName: string): Promise<DisplayName> {
    const name: DisplayName = {displayName: displayName};
    return this.baseService.post(this.endPoints.saveDisplayName, name);
  }
}
