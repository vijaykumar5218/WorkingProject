import {Injectable, OnDestroy} from '@angular/core';
import {CapQualtrics, CapQualtricsPlugin, QResult} from 'capacitor-qualtrics';
import {QualtricsProperty} from './constants/qualtrics-properties.enum';
import {QualtricsIntercept} from './constants/qualtrics-intercepts.enum';
import {
  QUALTRICS_BRAND_ID,
  QUALTRICS_PROJECT_ID,
  QUALTRICS_EXT_REF_ID,
} from './constants/qualtrics-config';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {Subscription} from 'rxjs';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Participant} from '@shared-lib/services/account/models/accountres.model';
import {Platform} from '@ionic/angular';

export const QUALTRICS_EVAL_INTERVAL = 10 * 1000; //35 seconds

export interface QualtricsUserProps {
  clientDomain: string;
  clientId: string;
  clientName: string;
  email: string;
  enableMyVoyage?: 'Y' | 'N';
  firstTimeLogin: boolean;
  mobile: string;
  partyId: string;
  appId: string;
  planIdList: Plan[];
  currentPlan: Plan;
  myVoyageEnabled: boolean;
}

interface Plan {
  planId: string;
  active: boolean;
  benefitsAdminSystem: string;
}
@Injectable({
  providedIn: 'root',
})
export class QualtricsService implements OnDestroy {
  endPoints = endPoints;
  qualtrics: CapQualtricsPlugin;
  subscription: Subscription;
  evalTimer: NodeJS.Timeout;
  userProperties: QualtricsUserProps;

  constructor(
    private router: Router,
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private platform: Platform
  ) {
    this.qualtrics = CapQualtrics;
    this.initializeWeb();
  }

  initializeWeb() {
    if (this.utilityService.getIsWeb()) {
      this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    }
  }

  async initializeMobile() {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    const result = await this.qualtrics.initialize({
      brandID: QUALTRICS_BRAND_ID,
      projectID: QUALTRICS_PROJECT_ID,
      extRefID: QUALTRICS_EXT_REF_ID,
    });
    if (result.success) {
      this.setUpRouteListener();
      this.startEvaluationTimer();
    }
  }

  setUpRouteListener() {
    this.subscription = this.router.events.subscribe(
      this.routeChanged.bind(this)
    );
  }

  routeChanged(event: RouterEvent) {
    if (event instanceof NavigationEnd) {
      const pageUrl = event.urlAfterRedirects;
      this.registerViewVisit(pageUrl);
      this.setProperty(QualtricsProperty.PAGE_NAME, pageUrl);
    }
  }

  startEvaluationTimer() {
    this.clearEvaluationTimer();
    this.evalTimer = setInterval(
      this.evaluateProject.bind(this),
      QUALTRICS_EVAL_INTERVAL
    );
  }

  clearEvaluationTimer() {
    if (this.evalTimer) {
      clearInterval(this.evalTimer);
    }
  }

  async getUserProperties(): Promise<QualtricsUserProps> {
    if (!this.userProperties) {
      this.userProperties = await this.baseService.get(
        this.endPoints.qualtricsUserProps
      );
    }
    return this.userProperties;
  }

  async setUserProperties(paticipant: Participant) {
    const result: QualtricsUserProps = await this.getUserProperties();
    this.setProperty(QualtricsProperty.APP_ID, result.appId);
    this.setProperty(QualtricsProperty.CLIENT_ID, result.clientId);

    const planIds = [];
    result.planIdList.forEach(plan => {
      planIds.push(plan.planId);
    });
    this.setProperty(QualtricsProperty.PLAN, planIds.join(','));
    this.setProperty(QualtricsProperty.PARTY_ID, result.partyId);
    this.setProperty(QualtricsProperty.EMAIL, result.email);
    this.setProperty(QualtricsProperty.PHONE, result.mobile);
    this.setProperty(
      QualtricsProperty.FIRST_TIME_USER,
      result.firstTimeLogin ? 'Y' : 'N'
    );
    this.setProperty(QualtricsProperty.FIRST_NAME, paticipant.firstName);
    if (this.platform.is('ios')) {
      this.setProperty(QualtricsProperty.DEVICE_TYPE, 'ios');
    } else if (this.platform.is('android')) {
      this.setProperty(QualtricsProperty.DEVICE_TYPE, 'android');
    } else {
      this.setProperty(QualtricsProperty.DEVICE_TYPE, 'web');
    }
  }

  async setProperty(prop: QualtricsProperty, val: string): Promise<QResult> {
    return this.qualtrics.setProperty({propName: prop, propVal: val});
  }

  async registerViewVisit(viewName: string): Promise<QResult> {
    return this.qualtrics.registerViewVisit({viewName: viewName});
  }

  async evaluateProject(bypass = false): Promise<QResult> {
    return this.qualtrics.evaluate({bypass: bypass});
  }

  async evaluateInterceptId(
    interceptId: QualtricsIntercept,
    bypass = false
  ): Promise<QResult> {
    return this.qualtrics.evaluateInterceptId({
      interceptId: interceptId,
      bypass: bypass,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.clearEvaluationTimer();
  }
}
