import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import pageText from './constants/all-accounts.json';
import {AllAccountPageText} from './model/all-account.model';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';

@Component({
  selector: 'app-all-accounts',
  templateUrl: 'all-accounts.page.html',
  styleUrls: ['all-accounts.page.scss'],
})
export class AllAccountsPage {
  selectedTab: string;
  pageData: AllAccountPageText = pageText;
  subscription: Subscription = new Subscription();
  isMxUser: boolean;
  enableCoverages: boolean;
  tabs: SubHeaderTab[];
  healthOnly = false;
  constructor(
    private router: Router,
    private accessService: AccessService,
    private mxService: MXService
  ) {}

  async ngOnInit() {
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(data => {
        this.isMxUser = data;

        this.tabs = [];
        if (!this.isMxUser) {
          this.tabs = this.pageData.tabs.filter(tab => {
            if (tab.link == 'summary') {
              return true;
            }
            return false;
          });
        } else {
          this.tabs = this.pageData.tabs;
        }
      })
    );
    this.routerNavigation();
    const {
      enableCoverages,
      isHealthOnly,
    } = await this.accessService.checkMyvoyageAccess();
    this.healthOnly = isHealthOnly;
    this.enableCoverages = enableCoverages;
  }

  routerNavigation() {
    const routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const arrOfUrl = event['url'].split('/');
        this.selectedTab = arrOfUrl[3] ? arrOfUrl[3] : 'summary';
      });
    this.subscription.add(routerSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
