import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MXErrorComponentModule} from '@shared-lib/components/mx-error/mxerror.module';
import {AccountWidgetModule} from './components/accounts-widgets/account-widget.module';
import {ExpandableAccountListComponent} from './components/expandable-account-list/expandable-account-list.component';
import {AccountsComponent} from './accounts.component';
import {BalanceHistoryGraphModule} from '@web/app/modules/features/workplace-dashboard/home/components/accounts-coverages/components/accounts/components/balance-history-graph/balance-history-graph.module';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AccountWidgetModule,
    MXErrorComponentModule,
    BalanceHistoryGraphModule
  ],
  declarations: [
    AccountsComponent,
    ExpandableAccountListComponent
  ],
  exports: [AccountsComponent],
})
export class AccountsComponentsModule {}
