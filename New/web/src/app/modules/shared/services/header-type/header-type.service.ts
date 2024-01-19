import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject} from 'rxjs';
import {WebQualtricsService} from '../web-qualtrics/web-qualtrics.service';
import {SessionTimeoutService} from '../session-timeout/session-timeout.service';
import {WebLogoutService} from '../logout/logout.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MoreResourcesLinks} from './models/MoreResource.model';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AccessService} from '@shared-lib/services/access/access.service';
import {endPoints} from './constants/endpoints';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderTypeService {
  private selectedTab$: ReplaySubject<string> = new ReplaySubject<string>(1);
  private endpoints = endPoints;
  private moreResourcesData: Observable<MoreResourcesLinks>;

  constructor(
    private qualtricsSrvice: WebQualtricsService,
    private sessionTimeoutService: SessionTimeoutService,
    private logoutService: WebLogoutService,
    private utilityService: SharedUtilityService,
    private baseService: BaseService,
    private accessService: AccessService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
  }

  getSelectedTab$(): ReplaySubject<string> {
    return this.selectedTab$;
  }

  publishSelectedTab(selectedTab: string) {
    this.selectedTab$.next(selectedTab);
  }

  logoutURLInitialize() {
    this.logoutService.constructLogoutURL();
  }

  backToPrevious() {
    this.utilityService.backToPrevious();
  }

  qualtricsInitialize(feedbackInterceptId?: string) {
    this.qualtricsSrvice.initialize(feedbackInterceptId);
  }

  sessionTimeoutWatcherInitiated() {
    this.sessionTimeoutService.watcherInitiated();
  }

  private async constructMoreResources(): Promise<MoreResourcesLinks> {
    const sessionID = await this.accessService.getSessionId();
    return this.baseService.get(
      `${this.endpoints.moreResources}?sessionID=${sessionID}`
    );
  }

  getMoreResource(refresh = false): Observable<MoreResourcesLinks> {
    if (!this.moreResourcesData || refresh) {
      this.moreResourcesData = from(this.constructMoreResources());
    }
    return this.moreResourcesData.pipe(
      filter(
        data =>
          data.resourceLink?.subLinks && data.resourceLink.subLinks.length > 0
      )
    );
  }
}
