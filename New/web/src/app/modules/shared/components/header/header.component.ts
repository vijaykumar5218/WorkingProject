import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {filter, map, startWith, take} from 'rxjs/operators';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {AltAccessService} from '../../services/alt-access/alt-access.service';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedTab: string;
  subscription: Subscription = new Subscription();
  isWorkplaceHeader: boolean;
  isHeaderReady: boolean;
  sessionId: string;
  loginBaseUrl: string;
  smartBannerTop = '0px';

  constructor(
    private headerTypeService: HeaderTypeService,
    private journeyService: JourneyService,
    private router: Router,
    private journeyUtilityService: JourneyUtilityService,
    private accessService: AccessService,
    private eventManager: EventManagerService,
    private altAccessService: AltAccessService
  ) {}

  async ngOnInit() {
    this.subscription.add(
      this.headerTypeService
        .getSelectedTab$()
        .subscribe(tab => (this.selectedTab = tab))
    );
    this.headerTypeService.logoutURLInitialize();
    this.isWorkplaceHeader = (
      await this.accessService.checkWorkplaceAccess()
    ).myWorkplaceDashboardEnabled;
    this.isHeaderReady = true;
    this.routerNavigation();
    this.headerTypeService.sessionTimeoutWatcherInitiated();
    this.subscription.add(
      this.eventManager
        .createSubscriber(eventKeys.smartBannerStickToTop)
        .subscribe(data => {
          this.smartBannerTop = data;
        })
    );
    const isAltAccessUser = (await this.accessService.checkMyvoyageAccess())
      ?.isAltAccessUser;
    if (isAltAccessUser) {
      this.altAccessService.createAndShowModal();
    }
  }

  routerNavigation() {
    const routerNavigation = this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        ),
        startWith(this.router),
        map((navigationEnd: NavigationEnd | NavigationStart) => {
          return navigationEnd.url;
        })
      )
      .subscribe((url: string) => {
        if (!url.includes('journeys') && this.selectedTab === 'LIFE_EVENTS') {
          this.journeyService.publishLeaveJourney();
        } else {
          this.journeyRouterNavigation(url);
        }
      });
    this.subscription.add(routerNavigation);
  }

  journeyRouterNavigation(url: string) {
    if (url === '/journeys') {
      this.journeyService
        .fetchJourneys()
        .pipe(take(1))
        .subscribe((journeysResponse: JourneyResponse) => {
          this.journeyUtilityService.routeToFirstJourney(journeysResponse);
        });
    }
    if (url.includes('journeys')) {
      this.headerTypeService.publishSelectedTab('LIFE_EVENTS');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
