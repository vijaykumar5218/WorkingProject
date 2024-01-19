import {Injectable} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/compat/analytics';
import {NavigationEnd, Router} from '@angular/router';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';
import {QualtricsUserProps} from '@shared-lib/services/qualtrics/qualtrics.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from './constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class WebGoogleAnalyticsService {
  endPoints = endPoints;

  constructor(
    private googleAnalyticsService: GoogleAnalyticsService,
    private utilityService: SharedUtilityService,
    private fireAnalytics: AngularFireAnalytics,
    private router: Router
  ) {}

  listenForEvents() {
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(
      this.endPoints
    );
    window.addEventListener(
      'click',
      function(e) {
        this.listenFunctionality(e);
      }.bind(this),
      false
    );
  }

  async listenFunctionality(e: MouseEvent) {
    const nodes = this.googleAnalyticsService.getEventCategory(
      e.composedPath()
    );
    if (nodes.length > 0) {
      let eventDetail = nodes
        .map(el => {
          return el.nodeName + ' ';
        })
        .join('');
      if (nodes[0]['href']) {
        eventDetail += nodes[0]['href'];
      }
      const eventLabelWithCustom = await this.googleAnalyticsService.getEventLabel(
        nodes
      );
      this.elementCategory(e, nodes, eventLabelWithCustom, eventDetail);
    }
  }

  async elementCategory(
    e: MouseEvent,
    nodes: any[],
    eventLabelWithCustom: string[],
    eventDetail: string
  ) {
    const gaObject = this.googleAnalyticsService.getGAObjectForClickEvent(
      e,
      nodes,
      eventLabelWithCustom,
      eventDetail
    );
    if (
      gaObject.eventCategory &&
      (gaObject.eventLabel || gaObject.eventLabelCustom || gaObject.eventDetail)
    ) {
      await this.fireAnalytics.logEvent('action', gaObject);
    }
  }

  listenForNavigationEnd() {
    this.fireAnalytics.setAnalyticsCollectionEnabled(true);
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        await this.trackingFunctionality(event);
      }
    });
  }

  manageUserProperties(result: QualtricsUserProps): Record<string, string> {
    const obj = {};
    if (result.partyId) {
      obj['userId'] = result.partyId;
    }
    obj['clientId'] = result.clientId;
    if (result.currentPlan?.planId) {
      obj['planId'] = result.currentPlan.planId;
    }
    obj['appId'] = localStorage.getItem('appId');

    return obj;
  }

  async trackingFunctionality(event) {
    const result: QualtricsUserProps = await this.getQualtricsUser();
    const userProperties = this.manageUserProperties(result);
    await this.fireAnalytics.setUserProperties(userProperties);
    const gaScrubbedURL = event?.urlAfterRedirects?.replace('#', '');
    if (event.url) {
      const gaObject = {
        page_location: '/myVoyage' + event.url,
        userId: result?.partyId,
        appId: localStorage.getItem('appId'),
      };
      await this.fireAnalytics.logEvent('virtualPageView', gaObject);
    }
    gaScrubbedURL && (await this.fireAnalytics.setCurrentScreen(gaScrubbedURL));
  }

  async getQualtricsUser(): Promise<QualtricsUserProps> {
    return this.googleAnalyticsService.getQualtricsUser(
      this.endPoints.qualtricsUserProps
    );
  }
}
