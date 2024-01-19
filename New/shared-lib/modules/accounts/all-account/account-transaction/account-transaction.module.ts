import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AccountTransactionPageRoutingModule} from './account-transaction-routing.module';
import {AccountTransactionPage} from './account-transaction.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountTransactionPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [AccountTransactionPage],
})
export class AccountTransactionPageModule {}
