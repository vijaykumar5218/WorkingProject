import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AccountPageRoutingModule} from './account-routing.module';

import {HttpClientModule} from '@angular/common/http';
import {MadlibModalComponentModule} from '@shared-lib/modules/orange-money/component/madlib-modal/madlib-modal.module';
import {PopupInputDialogModule} from '@shared-lib/components/popup-input-dialog/popup-input-dialog.module';
import {AccountPage} from './account.page';
import {SummaryModule} from './summary/summary.module';
import {AccountTransactionPageModule} from '@shared-lib/modules/accounts/all-account/account-transaction/account-transaction.module';
import {AccountSummaryModule} from '@shared-lib/modules/accounts/components/account-summary/account-summary.module';
import {NetWorthModule} from '@shared-lib/components/net-worth/net-worth.module';
import {InsightsModule} from './insights/insights.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    HttpClientModule,
    PopupInputDialogModule,
    MadlibModalComponentModule,
    AccountSummaryModule,
    NetWorthModule,
    SummaryModule,
    AccountTransactionPageModule,
    InsightsModule,
  ],
  declarations: [AccountPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountPageModule {}
