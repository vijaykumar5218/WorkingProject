import {Component} from '@angular/core';
import pageText from './constants/account-details.json';
import {AccountDetailsPageText} from './model/account-details.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {eventKeys} from '@shared-lib/constants/event-keys';
import {Account} from '@shared-lib/services/account/models/accountres.model';
import {AccessService} from '@shared-lib/services/access/access.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {NavigationModel} from '@shared-lib/services/utility/models/utility.models';
@Component({
  selector: 'app-account-details',
  templateUrl: 'account-details.page.html',
  styleUrls: ['account-details.page.scss'],
})
export class AccountDeatilsPage {
  pageData: AccountDetailsPageText = pageText;
  selectedTab: string;
  isRoutingActive = false;
  subscription: Subscription = new Subscription();
  lifecyclePublisher: Publisher;
  showGoToAccountButton: boolean;
  showGoToMyHistoryButton: boolean;
  account: Account;
  targetOfManageAcct: string;
  isMxUser: boolean;
  myWorkplaceDashboardEnabled: boolean;

  constructor(
    private accountService: AccountService,
    private utilityService: SharedUtilityService,
    private eventManagerService: EventManagerService,
    private mxService: MXService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.lifecyclePublisher = this.eventManagerService.createPublisher(
      eventKeys.refreshAccountInfo
    );
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(data => {
        this.isMxUser = data;
      })
    );
  }

  ionViewWillEnter() {
    const fetchPlanIdSubscription = this.utilityService
      .fetchUrlThroughNavigation(3)
      .subscribe(data => {
        this.isRoutingActive = false;
        this.fetchAcct(data);
      });
    this.subscription.add(fetchPlanIdSubscription);
  }

  fetchAcct(data: NavigationModel) {
    const getAccountLocalStorageSubscription = this.accountService
      .getAccountLocalStorage()
      .subscribe(acct => {
        this.account = acct;
        this.targetOfManageAcct = this.account?.portalSupportFlag
          ? '_self'
          : '_blank';
        this.pageData.tabs = !(
          this.account.isVendorPlan ||
          this.account.isVoyaAccessPlan ||
          this.account.sourceSystem == 'VENDOR' ||
          this.account.sourceSystem == 'STOCK' ||
          this.account.sourceSystem == 'BROKERAGE' ||
          this.account.sourceSystem == 'NQPenCalPlan'
        )
          ? this.pageData.default_tabs
          : this.pageData.without_transactions_tabs;
        let planId = this.account.planId;
        if (this.account.isVoyaAccessPlan) {
          planId =
            this.account.planId +
            '-isVoyaAccessPlan-' +
            this.account.agreementId;
        }
        if (planId === data?.paramId) {
          const arrOfUrl = data.url.split('/');
          this.selectedTab = arrOfUrl[4];
          this.isRoutingActive = true;
          this.manageGoToAccountButton();
          if (this.selectedTab !== 'transactions') {
            this.lifecyclePublisher.publish(undefined);
          }
        }
      });
    this.subscription.add(getAccountLocalStorageSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async manageGoToAccountButton() {
    if (this.account && this.account.isHSAAccount) {
      this.account.planLink = this.account.hsaAccountData.Plan_Link;
      if (this.account.hsaAccountData?.OLD_PLANLINK) {
        this.account.oldPlanLink = this.account.hsaAccountData.OLD_PLANLINK;
      }
    }
    this.myWorkplaceDashboardEnabled = (
      await this.accessService.checkWorkplaceAccess()
    ).myWorkplaceDashboardEnabled;
    this.showGoToAccountButton =
      this.myWorkplaceDashboardEnabled &&
      this.account.planLink &&
      this.account.planLink !== '~DEFAULT~'
        ? true
        : false;
    this.showGoToMyHistoryButton =
      this.myWorkplaceDashboardEnabled &&
      this.account.oldPlanLink &&
      this.account.oldPlanLink !== '~DEFAULT~'
        ? true
        : false;
  }

  navigateToGoToAccount(link: string) {
    this.accountService.openPwebAccountLink(link, this.targetOfManageAcct);
  }

  navigateToGoMyHistory(link: string) {
    this.accountService.openPwebAccountLink(link);
  }
}
