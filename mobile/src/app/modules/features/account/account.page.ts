import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import * as pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {SubHeaderTab} from 'shared-lib/models/tab-sub-header.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {Subscription} from 'rxjs';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {AccessService} from '@shared-lib/services/access/access.service';

export const ACCOUNT_LIFECYCLE_EVENTS = 'account_lifecycle_events';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  pageText = JSON.parse(JSON.stringify(pageText)).default;
  accounts: Account[];
  account: Account;

  actionOption: ActionOptions = {
    headername: 'Accounts',
    btnright: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  tabs: SubHeaderTab[] = [];
  selectedTab = 'summary';
  selectedTabSubscription: Subscription;
  lifecyclePublisher: Publisher;
  subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private eventManagerService: EventManagerService,
    private mxService: MXService,
    private accessService: AccessService
  ) {}

  ngOnInit(): void {
    this.lifecyclePublisher = this.eventManagerService.createPublisher(
      ACCOUNT_LIFECYCLE_EVENTS
    );
    this.setupTabs();
    this.selectedTabSubscription = this.accountService
      .getSelectedTab$()
      .subscribe((selectedTab: string) => {
        this.selectedTab = selectedTab;
      });
  }

  ionViewWillEnter() {
    this.lifecyclePublisher.publish('viewWillEnter');

    this.account = this.accountService.getAccount();
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.footerType.publish({type: FooterType.tabsnav, selectedTab: 'account'});
  }

  setupTabs() {
    this.subscription = this.mxService
      .getIsMxUserByMyvoyageAccess()
      .subscribe(isMxUser => {
        this.accessService.checkMyvoyageAccess().then(accessRes => {
          this.tabs = [];
          this.tabs.push({
            label: this.pageText.summary,
            link: 'summary',
          });

          if (!accessRes.isHealthOnly || isMxUser) {
            this.tabs.push({
              label: this.pageText.insights,
              link: 'insights',
            });
            this.tabs.push({
              label: this.pageText.transactions,
              link: 'account-transaction',
            });
          }
        });
      });
  }

  handleClick(selectedTab: SubHeaderTab) {
    this.selectedTab = selectedTab.link;
  }

  ngOnDestroy() {
    this.selectedTabSubscription.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
