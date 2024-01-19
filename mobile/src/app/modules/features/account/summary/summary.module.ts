import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SummaryRoutingModule} from './summary-routing.module';
import {SummaryComponent} from './summary.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RetirementAccountPageModule} from '../retirement-account/retirement-account.module';
import {AccountSummaryModule} from '@shared-lib/modules/accounts/components/account-summary/account-summary.module';
import {ManageAccountsPageModule} from '@shared-lib/modules/accounts/manage-accounts/manage-accounts.module';
import {NetWorthModule} from '@shared-lib/components/net-worth/net-worth.module';
import {BudgetWidgetModule} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.module';
import {SpendingWidgetModule} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.module';
import {MXAccountListModule} from '@shared-lib/modules/accounts/components/mx-account-list/mx-account-list.module';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {MXErrorComponentModule} from '@shared-lib/components/mx-error/mxerror.module';

@NgModule({
  declarations: [SummaryComponent],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    FormsModule,
    IonicModule,
    AccountSummaryModule,
    RetirementAccountPageModule,
    ManageAccountsPageModule,
    NetWorthModule,
    MXAccountListModule,
    MXWidgetModule,
    BudgetWidgetModule,
    SpendingWidgetModule,
    MXErrorComponentModule,
  ],
  exports: [SummaryComponent],
})
export class SummaryModule {}
