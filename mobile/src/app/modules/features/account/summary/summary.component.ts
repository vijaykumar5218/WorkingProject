import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Router} from '@angular/router';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ViewDidEnter, ViewWillEnter} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {
  Account,
  AccountsData,
} from '@shared-lib/services/account/models/accountres.model';
import {
  MXAccount,
  MXAccountRootObject,
} from '@shared-lib/services/mx-service/models/mx.model';
import {NetWorthComponent} from '@shared-lib/components/net-worth/net-worth.component';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {ACCOUNT_LIFECYCLE_EVENTS} from '../account.page';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent
  implements OnInit, ViewWillEnter, ViewDidEnter, OnDestroy {
  pageText = JSON.parse(JSON.stringify(pageText)).default;
  accounts: AccountsData;
  mxAccountData: MXAccount[];
  hasMXUser = false;
  showManageAccounts = false;
  actionOption: ActionOptions = {
    headername: 'Accounts',
    btnright: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  firstLoad = true;
  isHealthOnly = false;

  @ViewChild(NetWorthComponent) netWorthWidget: NetWorthComponent;
  @ViewChild(SpendingWidgetComponent) spendingWidget: SpendingWidgetComponent;
  @ViewChild(BudgetWidgetComponent) budgethWidget: BudgetWidgetComponent;

  private subscription: Subscription;
  private mxUserSubscription: Subscription;
  private eventsSubscription: Subscription;

  constructor(
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private accountService: AccountService,
    private mxService: MXService,
    private router: Router,
    private eventManagerService: EventManagerService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.subscription = this.mxService
      .getMxAccountConnect()
      .subscribe((data: MXAccountRootObject) => {
        this.showManageAccounts = data.accounts.length > 0;
      });

    this.mxUserSubscription = this.mxService
      .getIsMxUserByMyvoyageAccess()
      .subscribe(hasMXUser => {
        this.hasMXUser = hasMXUser;
      });

    this.accessService.checkMyvoyageAccess().then(accessRes => {
      this.isHealthOnly = accessRes.isHealthOnly;
    });
  }

  ionViewWillEnter(): void {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.footerType.publish({type: FooterType.tabsnav, selectedTab: 'account'});
    this.accountService.publishSelectedTab('summary');
    this.getAccountSummary();

    if (!this.firstLoad) {
      this.netWorthWidget.widget.refreshWidget();
      this.spendingWidget.widget.refreshWidget();
      this.budgethWidget.widget.refreshWidget();
    }
  }

  ionViewDidEnter(): void {
    if (this.firstLoad) {
      this.eventsSubscription = this.eventManagerService
        .createSubscriber(ACCOUNT_LIFECYCLE_EVENTS)
        .subscribe(this.ionViewWillEnter.bind(this));
    }
    this.firstLoad = false;
  }

  getAccountSummary() {
    this.accountService.getJSON().then(data => {
      this.accounts = data;
    });
  }

  sendtitle(account: Account) {
    if (account.isVoyaAccessPlan || account.sourceSystem == 'NQPenCalPlan') {
      return;
    }
    this.accountService.setAccount(account);
    this.router.navigateByUrl('/account/retirement-account');
  }

  routeToMXAccount() {
    this.router.navigateByUrl('/account/mxdetails-account');
  }

  handleManageAccountClick() {
    this.router.navigateByUrl('/account/manage-accounts');
  }

  handleAddAccountClick() {
    this.router.navigateByUrl('/account/add-accounts');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.mxUserSubscription.unsubscribe();
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
