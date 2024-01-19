import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {SummaryPageRoutingModule} from './summary-routing.module';
import {SummaryPage} from './summary.page';
import {BenefitsListComponentModule} from '@shared-lib/components/coverages/benefit-elections/benefit-list/benefits-list.module';
import {NoBenefitsComponentModule} from '@shared-lib/components/coverages/benefit-elections/no-benefits/no-benefits.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    NoBenefitsComponentModule,
    BenefitsListComponentModule,
  ],
  declarations: [SummaryPage],
})
export class SummaryPageModule {}
