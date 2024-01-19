import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  Account,
  AccountsData,
} from '@shared-lib/services/account/models/accountres.model';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
})
export class AccountSummaryComponent {
  @Input() accounts: AccountsData;
  @Output() clickedAccountInfo: EventEmitter<Account> = new EventEmitter<
    Account
  >();

  sendAccountInfo(event: Account) {
    this.clickedAccountInfo.emit(event);
  }
}
