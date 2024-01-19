import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SubHeaderComponentModule} from '@web/app/modules/shared/components/sub-header/sub-header.module';
import {AllAccountsPage} from './all-accounts.page';
import {AllAccountsPageRoutingModule} from './all-accounts-routing.module';
import {BalanceHistoryGraphModule} from '@web/app/modules/features/workplace-dashboard/home/components/accounts-coverages/components/accounts/components/balance-history-graph/balance-history-graph.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubHeaderComponentModule,
    AllAccountsPageRoutingModule,
    BalanceHistoryGraphModule
  ],
  declarations: [
    AllAccountsPage
  ],
  exports: [AllAccountsPage],
})
export class AllAccountsPageModule {}
