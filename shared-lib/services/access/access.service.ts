import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {SESSION_TIMEOUT_DURATION} from '../account/account.service';
import {BaseService} from '../base/base-factory-provider';
import {SettingsPreferences} from '../notification-setting/models/notification-settings-preferences.model';
import {SharedUtilityService} from '../utility/utility.service';
import {endpoints} from './constants/endpoints';
import {AccessResult} from './models/access.model';
import {WorkplaceAccessResult} from './models/workplaceAccess.model';
@Injectable({
  providedIn: 'root',
})
export class AccessService {
  private accessResult: AccessResult;
  private workplaceAccessResult: WorkplaceAccessResult;
  endpoints = endpoints;
  private currSessionExp = 0;
  private sessionId: string;
  private myWorkplaceDashboardEnabled$: ReplaySubject<boolean>;
  private lastPrefUpdatedResult: SettingsPreferences;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
    this.myWorkplaceDashboardEnabled$ = new ReplaySubject(1);
  }

  async checkMyvoyageAccess(refresh = false): Promise<AccessResult> {
    if (!this.accessResult || refresh) {
      this.accessResult = await this.baseService.get(
        this.endpoints.myvoyageAccess
      );
    }
    return this.accessResult;
  }

  async checkWorkplaceAccess(refresh = false): Promise<WorkplaceAccessResult> {
    try {
      if (!this.workplaceAccessResult || refresh) {
        const data = await this.checkMyvoyageAccess(refresh);
        this.myWorkplaceDashboardEnabled$.next(
          data.myWorkplaceDashboardEnabled
        );
        this.workplaceAccessResult = {
          myWorkplaceDashboardEnabled: data.myWorkplaceDashboardEnabled,
        };
      }
    } catch (e) {
      console.log(e);
      this.workplaceAccessResult = {myWorkplaceDashboardEnabled: false};
      this.myWorkplaceDashboardEnabled$.next(
        this.workplaceAccessResult.myWorkplaceDashboardEnabled
      );
    }
    return this.workplaceAccessResult;
  }

  async getSessionId(accessResult?: AccessResult): Promise<string> {
    if (!localStorage.getItem('sessionId')) {
      if (!accessResult) {
        accessResult = await this.checkMyvoyageAccess();
      }
      const {clientDomain, clientId} = accessResult;
      const sessionId = await this.initSession(clientDomain, clientId);
      localStorage.setItem('sessionId', sessionId);
    }
    return Promise.resolve(localStorage.getItem('sessionId'));
  }

  async initSession(domain: string, clientId: string): Promise<string> {
    if (!this.sessionId || new Date().getTime() > this.currSessionExp) {
      const initSession = {
        sessionInfo: {
          domain: domain,
          newSession: false,
          page: 'MYVOYA',
          clientId: clientId,
          timeoutMinutes: 15,
          application: 'MYVOYASSO',
        },
        allowDuplicate: false,
      };
      const result = await this.baseService.post(
        this.endpoints.InitSession,
        initSession
      );
      if (result) {
        this.currSessionExp = new Date().getTime() + SESSION_TIMEOUT_DURATION;
        this.sessionId = result.sessionId;
      }
    }
    return this.sessionId;
  }

  isMyWorkplaceDashboardEnabled(): Observable<boolean> {
    return this.myWorkplaceDashboardEnabled$.asObservable();
  }

  async checkLastPreferenceUpdated(): Promise<SettingsPreferences> {
    const myvoyageAccessResult = await this.checkMyvoyageAccess();
    if (
      myvoyageAccessResult &&
      myvoyageAccessResult.enableMyVoyage === 'Y' &&
      !this.lastPrefUpdatedResult
    ) {
      this.lastPrefUpdatedResult = await this.baseService.get(
        this.endpoints.preferenceLastUpdated
      );
    }
    return this.lastPrefUpdatedResult;
  }
}
