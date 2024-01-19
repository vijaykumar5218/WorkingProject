import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {ClaimsComponent} from './claims.component';
import {ModalHeaderComponentModule} from '@shared-lib/components/modal-header/modal-header.module';
import {ClaimsRoutingModule} from './claims-routing.module';
import {PlanTransactionsComponentModule} from '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions-component.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ModalHeaderComponentModule,
    ClaimsRoutingModule,
    PlanTransactionsComponentModule,
  ],
  declarations: [ClaimsComponent],
})
export class ClaimsModule {}
