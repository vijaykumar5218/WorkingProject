import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter, startWith} from 'rxjs/operators';
import pageText from './constants/all-coverages.json';
import {AllCoveragePageText} from '@shared-lib/components/coverages/models/modal-info.model';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {AccessService} from '@shared-lib/services/access/access.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';

interface Tab {
  label: string;
  link: string;
}

@Component({
  selector: 'app-all-coverages',
  templateUrl: 'all-coverages.page.html',
})
export class AllCovergesPage implements OnInit, OnDestroy {
  selectedTab: string;
  pageData: AllCoveragePageText;
  subscription: Subscription = new Subscription();
  isDesktop: boolean;
  offsetTop = 0;
  justGaveConsent: boolean;

  constructor(
    private router: Router,
    private platformService: PlatformService,
    private accessService: AccessService,
    private consentService: ConsentService
  ) {}

  ngOnInit() {
    this.routerNavigation();
    this.subscription.add(
      this.platformService.isDesktop().subscribe(data => {
        this.isDesktop = data;
      })
    );
    this.subscription.add(
      this.consentService.justGaveConsent.subscribe((justGave: boolean) => {
        this.justGaveConsent = justGave;
      })
    );
  }

  gotConsentVisibiltyChanged(vis: boolean) {
    this.offsetTop = vis ? 160 : 0;
  }

  routerNavigation() {
    const routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe(event => {
        this.handelEventUrl(event['url']);
      });
    this.subscription.add(routerSubscription);
  }

  handelEventUrl(url: string) {
    const arrOfUrl = url.split('/');
    console.log('all covergaes url :: ' + arrOfUrl);
    this.selectedTab = arrOfUrl[3] ? arrOfUrl[3] : 'insights';
    if (
      arrOfUrl[1] === 'coverages' &&
      (!arrOfUrl[2] || arrOfUrl[2] === 'all-coverages')
    ) {
      this.managingTabs();
    }
  }

  private filterElseTabs(tab: Tab): boolean {
    return (
      tab.link !== 'insights' &&
      tab.link !== 'tpaclaims' &&
      tab.link !== 'claims'
    );
  }

  async managingTabs() {
    const {
      enableBST,
      enableTPA,
    } = await this.accessService.checkMyvoyageAccess();

    const pText = {...pageText};
    if (enableTPA === 'Y') {
      pText.defaultTab = pText.defaultTab.filter(tab => tab.link !== 'claims');
      pText.tabs = pText.tabs.filter(tab => tab.link !== 'claims');
    } else if (enableBST === 'Y') {
      pText.defaultTab = pText.defaultTab.filter(
        tab => tab.link !== 'tpaclaims'
      );
      pText.tabs = pText.tabs.filter(tab => tab.link !== 'tpaclaims');
    } else {
      pText.defaultTab = pText.defaultTab.filter(tab =>
        this.filterElseTabs(tab)
      );
      pText.tabs = pText.tabs.filter(tab => this.filterElseTabs(tab));
    }
    this.pageData = pText;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
