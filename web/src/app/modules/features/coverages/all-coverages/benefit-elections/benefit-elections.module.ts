import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {BenefitElectionsPageRoutingModule} from './benefit-elections-routing.module';
import {BenefitElectionsPage} from './benefit-elections.page';
import {BenefitsListComponentModule} from '@shared-lib/components/coverages/benefit-elections/benefit-list/benefits-list.module';
import {NoBenefitsComponentModule} from '@shared-lib/components/coverages/benefit-elections/no-benefits/no-benefits.module';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BenefitElectionsPageRoutingModule,
    NoBenefitsComponentModule,
    BenefitsListComponentModule,
    HSAStoreNudgeComponentModule,
  ],
  declarations: [BenefitElectionsPage],
  exports: [BenefitElectionsPage],
})
export class BenefitElectionsPageModule {}
