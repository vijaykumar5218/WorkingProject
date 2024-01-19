import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {FinancialSummaryPageRoutingModule} from './financial-summary-routing.module';
import {FinancialSummaryPage} from './financial-summary.page';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinancialSummaryPageRoutingModule,
    MXWidgetModule,
  ],
  declarations: [FinancialSummaryPage],
})
export class FinancialSummaryPageModule {}
