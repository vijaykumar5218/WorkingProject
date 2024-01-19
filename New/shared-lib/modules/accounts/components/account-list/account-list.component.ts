import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  Account,
  AccountJsonModel,
} from '@shared-lib/services/account/models/accountres.model';
import pageText from '../../../../services/account/models/retirement-account/info/info-tab.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent {
  pageText: AccountJsonModel = pageText;
  @Output() accountClicked: EventEmitter<Account> = new EventEmitter<Account>();
  @Input() accounts: Account[];
  paramId: string;
  isWeb: boolean;
  subscription: Subscription = new Subscription();
  @Input() elementID: string;

  constructor(
    private utilityService: SharedUtilityService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.fetchParamId();
  }

  onAccountClicked(account: Account) {
    this.accountClicked.emit(account);
    if (this.isWeb) {
      if (!account.isVendorPlan) {
        if (account.isVoyaAccessPlan) {
          this.router.navigateByUrl(
            `accounts/account-details/${account.planId +
              '-isVoyaAccessPlan-' +
              account.agreementId}/info`
          );
        } else {
          this.router.navigateByUrl(
            `accounts/account-details/${account.planId}/info`
          );
        }
      }
    }
  }

  fetchParamId() {
    const routerSubscription = this.utilityService
      .fetchUrlThroughNavigation(3)
      .subscribe(data => {
        this.paramId = data?.paramId;
      });
    this.subscription.add(routerSubscription);
  }

  manageWidthOfCard(account: Account): Record<string, string> | null {
    if (this.isWeb) {
      if (
        this.paramId === account.planId &&
        !(account.isVendorPlan || account.isVoyaAccessPlan)
      ) {
        this.accountService.setAccountLocalStorage(account);
        return {width: '480px'};
      } else {
        if (
          account.isVoyaAccessPlan &&
          this.paramId ===
            account.planId + '-isVoyaAccessPlan-' + account.agreementId
        ) {
          this.accountService.setAccountLocalStorage(account);
          return {width: '480px'};
        } else {
          return {width: 'auto'};
        }
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
