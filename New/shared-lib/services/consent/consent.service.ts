import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  from,
  Observable,
  ReplaySubject,
  Subscription,
} from 'rxjs';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {ConsentType} from './constants/consentType.enum';
import {endpoints} from './constants/endpoints';
import {ConsentStatus} from './model/consent.model';
import {NavigationStart, Router} from '@angular/router';
import {skip} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private endpoints;
  private subscription = new Subscription();
  private medicalConsentData: Observable<ConsentStatus>;
  private medicalConsentSubject: ReplaySubject<boolean> = new ReplaySubject<
    boolean
  >(1);

  justGaveConsent = new BehaviorSubject<boolean>(false);

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private router: Router
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endpoints);
  }

  getMedicalConsent(refresh = false): Observable<boolean> {
    if (!this.medicalConsentData || refresh) {
      this.medicalConsentData = from(
        this.baseService.post(this.endpoints.getConsent, {
          consentTypeName: ConsentType.MEDICAL,
        })
      );
      const subscription = this.medicalConsentData.subscribe(result =>
        this.medicalConsentSubject.next(result.consentStatus === 'APPROVED')
      );
      this.subscription.add(subscription);
    }
    return this.medicalConsentSubject;
  }

  setConsent(type: ConsentType, approved: boolean): Promise<void> {
    if (approved) {
      this.setJustGaveConsent();
    }
    return this.baseService.post(this.endpoints.saveConsent, {
      consentTypeName: type,
      consentStatus: approved ? 'APPROVED' : 'DENIED',
    });
  }

  setJustGaveConsent() {
    this.justGaveConsent.next(true);
    const sub = this.router.events.pipe(skip(1)).subscribe(async event => {
      if (event instanceof NavigationStart) {
        this.justGaveConsent.next(false);
        sub.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
