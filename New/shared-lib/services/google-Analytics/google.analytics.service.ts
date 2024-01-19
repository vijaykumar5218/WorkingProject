import {Injectable} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {FirebaseAnalytics} from '@capacitor-community/firebase-analytics';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endPoints} from '@shared-lib/services/qualtrics/constants/endpoints';
import {QualtricsUserProps} from '@shared-lib/services/qualtrics/qualtrics.service';
import {GAObject} from './models/google.analytics.model';
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  isGAInfoSetOnce: boolean;
  isBlanacesGAInfoSet: boolean;
  endPoints = endPoints;
  QualtricsUserContent: QualtricsUserProps;

  constructor(
    private router: Router,
    private baseService: BaseService,
    private utilityService: SharedUtilityService
  ) {}

  getEventCategory(path: Array<any>): Array<any> {
    const nodes = [];
    let innerText = '';
    let isIONICElement = '';
    path.forEach(el => {
      const elementMatchArr = [
        'BUTTON',
        'ION-BUTTON',
        'ION-TOGGLE',
        'IMG',
        'A',
        'NAV',
      ];
      const isElementMatch = elementMatchArr.find(
        element => element === el.nodeName
      );
      if (isElementMatch) {
        nodes.push(el.cloneNode(true));
        if (!innerText && el.innerText) {
          innerText = el.innerText;
        }
      }
      if (!isIONICElement) {
        isIONICElement = isElementMatch;
      }
    });
    if (innerText && !nodes[0].innerText) {
      nodes[0].text = innerText;
    }
    if (isIONICElement) {
      return nodes;
    } else {
      return [];
    }
  }

  getURL(url: string): string {
    const hostName = url.substring(0, url.indexOf('?'));
    const hash = url.substring(url.indexOf('#'), url.length);
    return hostName + hash;
  }

  async getEventLabel(nodes: Array<any>): Promise<string[]> {
    let eventLabel = '';
    let gaAction = '';
    let gaCategory = '';
    let gaLabel = '';

    const node = nodes[0];
    const props = [
      'gaAction',
      'gaCategory',
      'gaLabel',
      'href',
      'link',
      'id',
      'linkText',
      'tabtext',
      'innerText',
      'text',
      'name',
      'altLabel',
      'value',
      'tileTitle',
      'tileHref',
      'currentTopic',
      'data-index',
      'aria-label',
    ];
    for (const prop of props) {
      if (node[prop]) {
        if (
          ['linkText', 'innerText', 'text', 'tileTitle', 'tabtext'].includes(
            prop
          ) &&
          typeof node[prop] === 'string'
        ) {
          eventLabel += await this.getEventLabelFromNode(nodes, node, prop);
        } else if (
          ['href', 'tileHref'].includes(prop) &&
          node[prop].indexOf('?') !== -1
        ) {
          eventLabel += `<${prop}: ${this.getURL(node[prop])}>`;
        } else {
          const gaOptions = await this.getGAOptions(prop, node);
          gaAction = gaOptions[0];
          gaCategory = gaOptions[1];
          gaLabel = gaOptions[2];
          eventLabel += gaOptions[3];
        }
      } else if (node.getAttribute(prop)) {
        const attributes = await this.nodeGetAttribute(prop, node);
        eventLabel = attributes[0];
        gaAction = attributes[1];
        gaCategory = attributes[2];
        gaLabel = attributes[3];
      } else if (['id'].includes(prop) && nodes[1] && nodes[1][prop]) {
        eventLabel += `<${prop}: ${nodes[1][prop]}>`;
      }
    }
    return [eventLabel, gaAction, gaCategory, gaLabel];
  }

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

  async getGAOptions(prop: string, node): Promise<string[]> {
    return new Promise(resolve => {
      let gaAction = '';
      let gaCategory = '';
      let gaLabel = '';
      if (prop === 'gaAction') {
        gaAction = `${node.getAttribute(prop)}`;
      } else if (prop === 'gaCategory') {
        gaCategory = `${node.getAttribute(prop)}`;
      } else if (prop === 'gaLabel') {
        gaLabel = `${node.getAttribute(prop)}`;
      }
      resolve([gaAction, gaCategory, gaLabel, `<${prop}: ${node[prop]}>`]);
    });
  }

  async getEventLabelFromNode(nodes, node, prop: string): Promise<string> {
    return new Promise(resolve => {
      if (
        node[prop].trim() === '' &&
        nodes[1] &&
        nodes[1][prop] &&
        nodes[1][prop].trim() !== ''
      ) {
        const txt = nodes[1][prop].trim();
        resolve(`<${prop}: ${txt.substring(0, 20)}>`);
      } else if (node[prop].trim() !== '') {
        const txt = node[prop].trim();
        resolve(`<${prop}: ${txt.substring(0, 20)}>`);
      }
    });
  }

  async nodeGetAttribute(prop: string, node): Promise<string[]> {
    return new Promise(resolve => {
      let eventLabel = '';
      let gaAction = '';
      let gaCategory = '';
      let gaLabel = '';
      eventLabel += `<${prop}: ${node.getAttribute(prop)}>`;
      if (prop === 'gaAction') {
        gaAction = `${node.getAttribute(prop)}`;
      } else if (prop === 'gaCategory') {
        gaCategory = `${node.getAttribute(prop)}`;
      } else if (prop === 'gaLabel') {
        gaLabel = `${node.getAttribute(prop)}`;
      }
      resolve([eventLabel, gaAction, gaCategory, gaLabel]);
    });
  }

  async listenFunctionality(e: MouseEvent, analytics = FirebaseAnalytics) {
    const nodes = this.getEventCategory(e.composedPath());
    if (nodes.length > 0) {
      let eventDetail = nodes
        .map(el => {
          return el.nodeName + ' ';
        })
        .join('');
      if (nodes[0]['href']) {
        eventDetail += nodes[0]['href'];
      }
      const eventLabelWithCustom = await this.getEventLabel(nodes);
      this.elementCategory(
        e,
        nodes,
        eventLabelWithCustom,
        eventDetail,
        analytics
      );
    }
  }

  async elementCategory(
    e: MouseEvent,
    nodes: any[],
    eventLabelWithCustom: string[],
    eventDetail: string,
    analytics
  ) {
    const gaObject = this.getGAObjectForClickEvent(
      e,
      nodes,
      eventLabelWithCustom,
      eventDetail
    );
    if (
      gaObject.eventCategory &&
      (gaObject.eventLabel || gaObject.eventLabelCustom || gaObject.eventDetail)
    ) {
      await analytics.logEvent({
        name: 'action',
        params: gaObject,
      });
    }
  }

  getGAObjectForClickEvent(
    e: any,
    nodes: any[],
    eventLabelWithCustom: string[],
    eventDetail: string,
    w = window
  ): GAObject {
    let eventCategory = nodes[0].nodeName;
    let eventLabel = eventLabelWithCustom[0];
    const gaAction = eventLabelWithCustom[1];
    const gaCategory = eventLabelWithCustom[2];
    const gaLabel = eventLabelWithCustom[3];

    //sending ion-alert message text
    if (eventLabel.includes('elementBtn')) {
      const alrtMessageContainer = (<HTMLElement>(
        e.target
      ))?.parentElement?.parentElement?.parentElement
        ?.getElementsByClassName('alert-message')[0]
        ?.innerHTML?.substring(0, 20);
      eventLabel = eventLabel
        ?.replace('elementBtn0', alrtMessageContainer)
        ?.replace('elementBtn1', alrtMessageContainer);
    }
    if ((<HTMLElement>e.target)?.tagName === 'IMG') {
      const parentElement = (<HTMLElement>e.target)?.parentElement;
      eventLabel = parentElement?.innerText;
      eventCategory = parentElement?.tagName;
      eventDetail = parentElement?.tagName;
    }

    return {
      eventCategory: eventCategory,
      eventAction: 'click',
      eventLabel: eventLabel,
      eventActionCustom: gaAction,
      eventCategoryCustom: gaCategory,
      eventLabelCustom: gaLabel || '',
      eventDetail: '<place: ' + eventDetail + '>',
      sessionId: '',
      page_location: '/myVoyage' + w.location.pathname || '',
    };
  }

  firebaseAnalyticsTracking(analytics = FirebaseAnalytics) {
    analytics.setCollectionEnabled({enabled: true});
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationEnd) {
        if (
          !event.urlAfterRedirects.includes('secure-sign-out') &&
          !event.urlAfterRedirects.includes('landing')
        ) {
          await this.trackingFunctionality(event, analytics);
        }
      }
    });
  }

  async trackingFunctionality(event, analytics) {
    const result = await this.getQualtricsUser();
    if (result.partyId) {
      await analytics.setUserProperty({
        name: 'userId',
        value: result.partyId,
      });
    }
    await analytics.setUserProperty({
      name: 'appId',
      value: localStorage.getItem('appId'),
    });
    await analytics.setUserProperty({
      name: 'clientId',
      value: result.clientId,
    });
    if (result.currentPlan?.planId) {
      await analytics.setUserProperty({
        name: 'planId',
        value: result.currentPlan.planId,
      });
    }
    const gaScrubbedURL = event?.urlAfterRedirects?.replace('#', '');
    if (event.url) {
      const gaObject = {
        page_location: '/myVoyage' + event.url,
        userId: result?.partyId,
      };
      await analytics.logEvent({
        name: 'virtualPageView',
        params: gaObject,
      });
    }
    gaScrubbedURL &&
      (await analytics.setScreenName({
        screenName: gaScrubbedURL,
      }));
  }

  async getQualtricsUser(endpointURL?: string): Promise<QualtricsUserProps> {
    if (!this.QualtricsUserContent) {
      await this.baseService
        .get(endpointURL ? endpointURL : this.endPoints.qualtricsUserProps)
        .then(response => {
          this.QualtricsUserContent = response;
        })
        .catch(() => {
          this.QualtricsUserContent = null;
        });
    }
    return this.QualtricsUserContent;
  }
}
