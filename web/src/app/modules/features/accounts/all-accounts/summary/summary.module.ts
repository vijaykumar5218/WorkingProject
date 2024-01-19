import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SummaryPage} from './summary.page';
import {SummaryPageRoutingModule} from './summary-routing.module';
import {BudgetWidgetModule} from '@shared-lib/modules/accounts/components/budget-widget/budget-widget.module';
import {SpendingWidgetModule} from '@shared-lib/modules/accounts/components/spending-widget/spending-widget.module';
import {NetWorthModule} from '@shared-lib/components/net-worth/net-worth.module';
import {AddAccountNudgeComponentModule} from '@shared-lib/components/home/add-account-nudge/add-account-nudge.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    BudgetWidgetModule,
    SpendingWidgetModule,
    NetWorthModule,
    AddAccountNudgeComponentModule,
  ],
  declarations: [SummaryPage],
  exports: [SummaryPage],
})
export class SummaryPageModule {}
