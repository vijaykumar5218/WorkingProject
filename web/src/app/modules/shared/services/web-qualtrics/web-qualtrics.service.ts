import {Injectable} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from '@shared-lib/services/qualtrics/constants/endpoints';
import {QualtricsUserProps} from '@shared-lib/services/qualtrics/qualtrics.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {QualtricsIntercept} from '@shared-lib/services/qualtrics/constants/qualtrics-intercepts.enum';
import {QualtricsProperty} from '@shared-lib/services/qualtrics/constants/qualtrics-properties.enum';
import {Platform} from '@ionic/angular';
import {Subscription} from 'rxjs';
import storageKey from './constants/storage-key.json';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Injectable({
  providedIn: 'root',
})
export class WebQualtricsService {
  endPoints = endPoints;
  qualtricsUserProps: QualtricsUserProps;
  participant: Participant;
  qualtricsStartupUrl: string;
  private subscription = new Subscription();
  storageKey = storageKey;
  feedbackInterceptId: string;

  constructor(
    private utilityService: SharedUtilityService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private accountService: AccountService,
    private platform: Platform,
    private router: Router,
    private accessService: AccessService
  ) {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(
      this.endPoints
    );
    this.qualtricsStartupUrl = this.utilityService.getEnvironment().qualtricsStartupUrl;
  }

  async initialize(feedbackInterceptId?: string) {
    this.feedbackInterceptId = feedbackInterceptId
      ? feedbackInterceptId
      : QualtricsIntercept.FEEDBACK_INTERCEPT_WEB;
    this.qualtricsUserProps = await this.googleAnalyticsService.getQualtricsUser(
      this.endPoints.qualtricsUserProps
    );
    await this.checkMyVoyageEnabled();
    this.subscription.add(
      this.accountService.getParticipant().subscribe(data => {
        this.participant = data;
        this.setUserProperties();
        this.setUpRouteListener();
      })
    );
  }

  async checkMyVoyageEnabled() {
    const {enableMyVoyage} = await this.accessService.checkMyvoyageAccess();
    if (enableMyVoyage === 'Y') {
      this.qualtricsUserProps.myVoyageEnabled = true;
    } else {
      this.qualtricsUserProps.myVoyageEnabled = false;
    }
  }

  setUserProperties() {
    const url = new URL(this.qualtricsStartupUrl);
    url.searchParams.set('Q_ZID', this.feedbackInterceptId);
    url.searchParams.set(QualtricsProperty.APP_ID, 'myVoyage');
    url.searchParams.set(
      QualtricsProperty.CLIENT_ID,
      this.qualtricsUserProps.clientId
    );
    localStorage.setItem(
      this.storageKey.CLIENT_ID,
      this.qualtricsUserProps.clientId
    );
    const planIds = [];
    this.qualtricsUserProps.planIdList.forEach(plan => {
      planIds.push(plan.planId);
    });
    url.searchParams.set(QualtricsProperty.PLAN, planIds.join(','));
    localStorage.setItem(this.storageKey.PLAN_ID, planIds.join(','));
    url.searchParams.set(
      QualtricsProperty.PARTY_ID,
      this.qualtricsUserProps.partyId
    );
    localStorage.setItem(
      this.storageKey.PARTY_ID,
      this.qualtricsUserProps.partyId
    );
    url.searchParams.set(
      QualtricsProperty.EMAIL,
      this.qualtricsUserProps.email
    );
    localStorage.setItem(this.storageKey.Email, this.qualtricsUserProps.email);
    url.searchParams.set(
      QualtricsProperty.MYVOYAGE_ENABLED,
      this.qualtricsUserProps.myVoyageEnabled ? 'true' : 'false'
    );
    localStorage.setItem(
      this.storageKey.MyVoyageEnabled,
      this.qualtricsUserProps.myVoyageEnabled ? 'true' : 'false'
    );
    url.searchParams.set(
      QualtricsProperty.PHONE,
      this.qualtricsUserProps.mobile
    );
    localStorage.setItem(this.storageKey.PHONE, this.qualtricsUserProps.mobile);
    url.searchParams.set(
      QualtricsProperty.FIRST_TIME_USER,
      this.qualtricsUserProps.firstTimeLogin ? 'Y' : 'N'
    );
    url.searchParams.set(
      QualtricsProperty.FIRST_NAME,
      this.participant.firstName
    );
    localStorage.setItem(
      this.storageKey.FIRST_NAME,
      this.participant.firstName
    );
    if (this.platform.is('ios')) {
      url.searchParams.set(QualtricsProperty.DEVICE_TYPE, 'ios');
    } else if (this.platform.is('android')) {
      url.searchParams.set(QualtricsProperty.DEVICE_TYPE, 'android');
    } else {
      url.searchParams.set(QualtricsProperty.DEVICE_TYPE, 'web');
    }
    this.startUpCall(url.href);
  }

  setUpRouteListener() {
    this.subscription.add(
      this.router.events.subscribe(this.routeChanged.bind(this))
    );
  }

  startUpCall(href: string) {
    const elem = document.createElement('div');
    elem.setAttribute('id', this.feedbackInterceptId);
    document.body.appendChild(elem);
    new window.WebQualtrics(
      100,
      'r',
      `QSI_S_${this.feedbackInterceptId}`,
      href
    ).start();
  }

  routeChanged(event: RouterEvent) {
    if (event instanceof NavigationEnd) {
      const pageUrl = event.urlAfterRedirects;
      localStorage.setItem(this.storageKey.PAGE_NAME, pageUrl);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
