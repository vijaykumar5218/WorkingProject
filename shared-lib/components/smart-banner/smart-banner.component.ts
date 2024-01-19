import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SmartBannerEnableConditions} from '@shared-lib/services/smart-banner/models/smart-banner.model';
import {SmartBannerService} from '@shared-lib/services/smart-banner/smart-banner.service';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-smart-banner',
  templateUrl: './smart-banner.component.html',
  styleUrls: [],
})
export class SmartBannerComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('smartbanner') vSmartbanner: ElementRef;
  subscription: Subscription = new Subscription();
  smartBannerTopPublisher: Publisher;
  smartBannerEnableConditions: SmartBannerEnableConditions = {
    isSmartBannerHidden: false,
    isSmartBannerDismissed: false,
  };
  currentUrl: string;

  constructor(
    private smartBannerService: SmartBannerService,
    private benefitsService: BenefitsService,
    public eventManager: EventManagerService,
    private router: Router
  ) {
    this.currentUrl = this.router.url;
  }
  ngOnInit() {
    this.listenSmartBannerDismissed();
    this.listenSmartBannerDisplayed();
    this.routerNavigation();
    this.getSmartBannerEnableConditions();
  }
  listenSmartBannerDisplayed() {
    window.addEventListener(
      'smartbanner:displayed',
      function() {
        this.smartBannerDisplayed();
      }.bind(this)
    );
  }
  listenSmartBannerDismissed() {
    window.addEventListener(
      'smartbanner:dismissed',
      function() {
        if (
          (!this.smartBannerEnableConditions ||
            (this.smartBannerEnableConditions &&
              !this.smartBannerEnableConditions.isSmartBannerDismissed &&
              !this.smartBannerEnableConditions.isSmartBannerHidden)) &&
          (this.currentUrl == '/home' ||
            this.currentUrl == '/workplace-dashboard')
        ) {
          this.benefitsService.setSmartBannerEnableConditions({
            isSmartBannerDismissed: true,
          });
        }
        this.smartBannerDismissed();
      }.bind(this)
    );
  }
  getSmartBannerEnableConditions() {
    const smartBannerSubscription = this.benefitsService
      .getSmartBannerEnableConditions()
      .subscribe(data => {
        this.smartBannerEnableConditions = data;
        if (
          this.smartBannerEnableConditions.isSmartBannerHidden ||
          this.smartBannerEnableConditions.isSmartBannerDismissed
        ) {
          this.vSmartbanner?.nativeElement.hide();
          this.smartBannerDismissed();
        } else if (
          this.currentUrl == '/home' ||
          this.currentUrl == '/workplace-dashboard'
        ) {
          this.setSmartBannerOptions();
          this.vSmartbanner?.nativeElement.show();
        }
      });
    this.subscription.add(smartBannerSubscription);
  }
  routerNavigation() {
    const routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        if (event.url != '/home' && event.url != '/workplace-dashboard') {
          this.benefitsService.setSmartBannerEnableConditions({
            isSmartBannerHidden: true,
          });
        } else {
          this.benefitsService.setSmartBannerEnableConditions({
            isSmartBannerHidden: false,
          });
        }
      });
    this.subscription.add(routeSubscription);
  }

  ngAfterViewInit() {
    if (
      (!this.smartBannerEnableConditions ||
        (this.smartBannerEnableConditions &&
          !this.smartBannerEnableConditions.isSmartBannerDismissed)) &&
      (this.currentUrl == '/home' || this.currentUrl == '/workplace-dashboard')
    ) {
      this.setSmartBannerOptions();
    }
  }

  async setSmartBannerOptions() {
    const smartBannerOptions = await this.smartBannerService.getSmartBannerOptions();
    this.vSmartbanner.nativeElement.createMetaTags(
      smartBannerOptions.title,
      smartBannerOptions.author,
      smartBannerOptions.icon,
      smartBannerOptions['button-url-apple'],
      smartBannerOptions.icon,
      smartBannerOptions['button-url-google']
    );
  }

  publishSmartBannerTop() {
    this.smartBannerTopPublisher = this.eventManager.createPublisher(
      eventKeys.smartBannerStickToTop
    );
  }

  smartBannerDisplayed() {
    if (
      !this.smartBannerEnableConditions?.isSmartBannerHidden &&
      !this.smartBannerEnableConditions?.isSmartBannerDismissed
    ) {
      this.publishSmartBannerTop();
      this.smartBannerTopPublisher.publish('84px');
    }
  }
  smartBannerDismissed() {
    this.publishSmartBannerTop();
    this.smartBannerTopPublisher.publish('0px');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
