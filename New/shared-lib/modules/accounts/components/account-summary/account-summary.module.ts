import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AccountSummaryComponent} from './account-summary.component';
import {AccountListModule} from '../account-list/account-list.module';
@NgModule({
  declarations: [AccountSummaryComponent],
  imports: [CommonModule, FormsModule, IonicModule, AccountListModule],
  exports: [AccountSummaryComponent],
})
export class AccountSummaryModule {}
