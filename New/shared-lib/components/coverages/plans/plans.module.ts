import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PlansPageRoutingModule} from './plans-routing.module';
import {PlansPage} from './plans.page';
import {NoBenefitsComponentModule} from '@shared-lib/components/coverages/benefit-elections/no-benefits/no-benefits.module';
import {MedDisclaimerModule} from '../med-disclaimer/med-disclaimer.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';
import {PaginationModule} from '@shared-lib/components/pagination/pagination.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlansPageRoutingModule,
    NoBenefitsComponentModule,
    MedDisclaimerModule,
    LoadingComponentModule,
    HSAStoreNudgeComponentModule,
    PaginationModule,
  ],
  declarations: [PlansPage],
  exports: [PlansPage],
})
export class PlansPageModule {}
