import {Component, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {QualtricsService} from '@shared-lib/services/qualtrics//qualtrics.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {environment} from '../../environments/environment';
import {GoogleAnalyticsService} from '@shared-lib/services/google-Analytics/google.analytics.service';
import {ScreenReader} from '@capacitor/screen-reader';
import {ErrorService} from './modules/shared/service/error-service/error.service';
import {Keyboard, KeyboardPlugin} from '@capacitor/keyboard';
import {PlatformService} from './modules/shared/service/platform/platform.service';
import {App, URLOpenListenerEvent} from '@capacitor/app';
import {AuthenticationService} from './modules/shared/service/authentication/authentication.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';
import {EventTrackingEvent} from '@shared-lib/services/event-tracker/models/event-tracking.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [],
})
export class AppComponent {
  keyboard: KeyboardPlugin = Keyboard;
  app: typeof App;
  private eventTrackingService: EventTrackingService;

  constructor(
    private utilityService: SharedUtilityService,
    private platformService: PlatformService,
    private router: Router,
    private googleAnalyticsService: GoogleAnalyticsService,
    private qualtricsService: QualtricsService,
    private errorService: ErrorService,
    private authService: AuthenticationService,
    private injector: Injector
  ) {
    this.app = App;
    this.listenForAppUrlOpen();
    this.backButtonEvent();
    this.hideKeypad();
  }

  private listenForAppUrlOpen() {
    this.app.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      if (event.url.includes('redirect_route=')) {
        this.authService.didLaunchWithURL(this.getAppRoute(event.url));
        this.captureDeepLinkEvent(event.url);
      }
    });
  }

  private getAppRoute(url: string): string {
    let route = '';
    if (url.includes('&')) {
      const splitRoute = url.split('redirect.html?')[1].split('&');
      let params = '';
      let i = 0;
      for (const queryParam of splitRoute) {
        if (queryParam.includes('redirect_route')) {
          const paramVal = queryParam
            .split('=')
            .slice(1)
            .join('=');
          route += paramVal;
        } else {
          params += splitRoute[i];
        }
        i++;
      }
      route += route.includes('?') ? '&' : '?';
      route += params;
    } else {
      const splitRoute = url.split('redirect_route=')[1];
      route += splitRoute;
    }
    return route;
  }

  logScrollStart() {
    if (this.platformService.keyboardDidShow()) {
      this.keyboard.hide();
    }
  }

  backButtonEvent() {
    window.addEventListener(
      'ionBackButton',
      function(ev) {
        console.log(ev);
        ev.detail.register(10, () => {
          this.router.navigateByUrl('/login');
        });
      }.bind(this),
      false
    );
  }

  ngOnInit() {
    if (
      !window.location.pathname.includes('landing') &&
      this.platformService.isIos() &&
      !environment.livereload
    ) {
      this.router.navigateByUrl('landing');
    }
    this.errorService.initialize();
    this.platformService.initialize();
    this.utilityService.setStatusBarStyleLight();
    this.utilityService.setEnvironment(environment);
    this.eventTrackingService = this.injector.get<EventTrackingService>(
      EventTrackingService
    );
    window.addEventListener('keyboardDidShow', () => {
      window.setTimeout(() => this.focusElement(), 0);
    });
    this.qualtricsService.initializeMobile();
    this.screenReading();
    this.googleAnalyticsService.listenForEvents();
    this.googleAnalyticsService.firebaseAnalyticsTracking();
  }

  async screenReading(sr = ScreenReader) {
    sr.addListener('stateChange', async ({value}) => {
      console.log(`Screen reader is now ${value ? 'on' : 'off'}`);
      if (await sr.isEnabled()) {
        sr.speak({value: 'Welcome to Voya.'});
      }
    });
  }
  focusElement() {
    const elementFocused: any = document.querySelector(':focus');
    if (elementFocused) {
      elementFocused.blur();
      elementFocused.focus();
    }
  }
  hideKeypad() {
    this.platformService.onReady$.subscribe(() => {
      this.platformService.onResume$.subscribe(() => {
        setTimeout(() => {
          this.logScrollStart();
        }, 1000);
      });
    });
  }
  ionViewWillLeave() {
    this.platformService.backButton().unsubscribe();
  }
  captureDeepLinkEvent(url: string) {
    const queryParams: Record<
      string,
      string
    > = this.utilityService.getQueryParams(url);
    if (queryParams?.source) {
      const eventTrackingEvent: EventTrackingEvent = {
        eventName: 'CTAClick',
        passThruAttributes: [
          {
            attributeName: 'subType',
            attributeValue: 'DeepLink',
          },
          {
            attributeName: 'source',
            attributeValue: queryParams.source,
          },
        ],
      };
      if (queryParams.redirect_route) {
        eventTrackingEvent.passThruAttributes.push({
          attributeName: 'redirect_route',
          attributeValue: queryParams.redirect_route,
        });
      }
      this.eventTrackingService.eventTrackingAfterAuthorized(
        eventTrackingEvent
      );
    }
  }
}
