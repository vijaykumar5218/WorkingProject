import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {AccountService} from '@shared-lib/services/account/account.service';
import {from, Observable, Subscription} from 'rxjs';
import pageText from './constants/account.json';
import {AccountPageText} from './model/account.model';
import TabsContent from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {
  AccountsData,
  AccountJsonModel,
} from '@shared-lib/services/account/models/accountres.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {BudgetWidgetComponent} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.component';
import {SpendingWidgetComponent} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.component';
import {
  MXAccountRootObject,
  RootObjectMX,
} from '@shared-lib/services/mx-service/models/mx.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccessService} from '@shared-lib/services/access/access.service';
@Component({
  selector: 'app-accounts',
  templateUrl: 'accounts.page.html',
  styleUrls: ['accounts.page.scss'],
})
export class AccountsPage {
  @Input() templateType: string;
  nonHSAaccounts: AccountsData;
  hsaAccounts: AccountsData;
  pageData: AccountPageText = pageText;
  tabsContent: AccountJsonModel = TabsContent;
  selectedAccountTab: Observable<string>;
  showManageAccounts = false;
  subscription: Subscription = new Subscription();
  isAllAccountsSelected: boolean;
  isDesktop: boolean;
  hasMXUser = false;
  myWorkplaceDashboardEnabled: boolean;
  @ViewChild(SpendingWidgetComponent) spendingWidget: SpendingWidgetComponent;
  @ViewChild(BudgetWidgetComponent) budgethWidget: BudgetWidgetComponent;
  @ViewChild('focusedElement', {static: true}) focusedElement: ElementRef;
  selectedTab: string;
  getHeaderMessage: RootObjectMX;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;
  isViewInit: boolean;
  enableMX: boolean;
  isAltAccessUser = false;

  constructor(
    private headerTypeService: HeaderTypeService,
    private accountService: AccountService,
    private mxService: MXService,
    private router: Router,
    private footerType: FooterTypeService,
    private sharedUtilityService: SharedUtilityService,
    private accessService: AccessService
  ) {}

  ngOnInit() {
    this.subscription.add(
      from(this.accessService.checkMyvoyageAccess()).subscribe(res => {
        this.myWorkplaceDashboardEnabled = res.myWorkplaceDashboardEnabled;
        this.enableMX = res.enableMX;
        this.isAltAccessUser = res.isAltAccessUser;
      })
    );
    this.sharedUtilityService.isDesktop().subscribe(data => {
      this.isDesktop = data;
      if (this.isViewInit) {
        const arrOfUrl = this.router.url.split('/');
        if (data) {
          this.allAccountSelected(arrOfUrl);
        } else {
          this.hideAccountList(arrOfUrl);
          this.hasMXWidget();
          this.fetchMXHeaderContent();
        }
      }
    });
    this.routerNavigation();
  }

  ngAfterViewInit() {
    this.footerType.publish({
      type: FooterType.tabsnav,
      selectedTab: 'accounts',
    });
    this.isViewInit = true;
  }

  routerNavigation() {
    const routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const arrOfUrl = event['url'].split('/');
        if (!this.isDesktop) {
          this.hideAccountList(arrOfUrl);
        } else {
          this.allAccountSelected(arrOfUrl);
        }
        this.sharedUtilityService.scrollToTop(this.topmostElement);
      });
    this.subscription.add(routerSubscription);
  }

  allAccountSelected(arrOfUrl: string[]) {
    if (
      arrOfUrl[1] === 'accounts' &&
      arrOfUrl[2] !== 'account-details' &&
      arrOfUrl[2] !== 'mxdetails-account' &&
      arrOfUrl[2] !== 'add-accounts' &&
      arrOfUrl[2] !== 'manage-accounts'
    ) {
      this.isAllAccountsSelected = true;
    } else {
      this.isAllAccountsSelected = false;
      this.focusOnElement();
    }
  }

  hideAccountList(arrOfUrl: string[]) {
    if (
      arrOfUrl[1] === 'accounts' &&
      arrOfUrl[2] !== 'account-details' &&
      arrOfUrl[2] !== 'mxdetails-account' &&
      arrOfUrl[2] !== 'add-accounts' &&
      arrOfUrl[2] !== 'manage-accounts' &&
      arrOfUrl[2] !== 'spending-widget' &&
      arrOfUrl[2] !== 'budget-widget'
    ) {
      this.selectedTab = arrOfUrl[3] ? arrOfUrl[3] : 'summary';
    } else {
      this.selectedTab = undefined;
    }
  }

  clickAllAccounts(): void {
    this.focusOnElement();
    this.router.navigateByUrl(`accounts/all-account/summary`);
  }

  focusOnElement() {
    const element = this.focusedElement.nativeElement as HTMLElement;
    element.focus();
  }

  handleAddAccountClick() {
    this.router.navigateByUrl(`accounts/add-accounts`);
  }

  handleManageAccountClick() {
    this.router.navigateByUrl(`accounts/manage-accounts`);
  }

  async ionViewWillEnter() {
    this.headerTypeService.publishSelectedTab('ACCOUNTS');
    const mxSubscription = this.mxService
      .getMxAccountConnect()
      .subscribe((data: MXAccountRootObject) => {
        this.showManageAccounts = data.accounts.length > 0;
      });
    this.subscription.add(mxSubscription);
    const allAccountsSubscription = this.accountService
      .allAccountsWithoutHSA()
      .subscribe(data => {
        this.nonHSAaccounts = data;
      });
    this.subscription.add(allAccountsSubscription);
    this.fetchHSAAcct();
    if (!this.isDesktop) {
      this.hasMXWidget();
      this.fetchMXHeaderContent();
      this.spendingAndBudgetWidget();
    }
  }

  fetchHSAAcct() {
    this.subscription.add(
      this.accountService.allAccountsWithHSA().subscribe(data => {
        this.hsaAccounts = data;
      })
    );
  }

  hasMXWidget() {
    const mxUserSubscription = this.mxService.hasUser().subscribe(hasMXUser => {
      this.hasMXUser = hasMXUser;
    });
    this.subscription.add(mxUserSubscription);
  }

  fetchMXHeaderContent() {
    const headerDataSubscription = this.mxService
      .getHeaderData()
      .subscribe(data => {
        this.getHeaderMessage = data;
      });
    this.subscription.add(headerDataSubscription);
  }

  spendingAndBudgetWidget() {
    this.spendingWidget.widget.refreshWidget();
    this.budgethWidget.widget.refreshWidget();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
