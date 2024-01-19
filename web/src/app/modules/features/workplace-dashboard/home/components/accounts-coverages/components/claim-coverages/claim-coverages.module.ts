import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ClaimCoveragesComponent} from './claim-coverages.component';
import {PlansPageModule} from '@shared-lib/components/coverages/plans/plans.module';
import {MedicalSpendingModule} from '@shared-lib/components/home/medical-spending/medical-spending.module';

@NgModule({
  imports: [CommonModule, IonicModule, PlansPageModule, MedicalSpendingModule],
  declarations: [ClaimCoveragesComponent],
  exports: [ClaimCoveragesComponent],
})
export class ClaimCoveragestModule {}
