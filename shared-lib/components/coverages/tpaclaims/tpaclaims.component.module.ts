import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ConsentRequiredComponentModule} from '@shared-lib/components/coverages/consent-required/consent-required.module';
import {TPAClaimsComponent} from './tpaclaims.component';
import {PlanTransactionsComponentModule} from '../plan-tabs/plan-transactions/plan-transactions-component.module';
import {TPAClaimsComponentRoutingModule} from './tpaclaims.component-routing.module';
import {TPAProvidersComponentModule} from './tpaproviders/tpaproviders.component.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';
import {TPAWarningComponent} from './tpawarning/tpawarning.component';
import {TPAStreamConnectPageModule} from '../tpastream-connect/tpastream-connect.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsentRequiredComponentModule,
    PlanTransactionsComponentModule,
    TPAClaimsComponentRoutingModule,
    TPAProvidersComponentModule,
    LoadingComponentModule,
    TPAStreamConnectPageModule,
  ],
  declarations: [TPAClaimsComponent, TPAWarningComponent],
  exports: [TPAClaimsComponent],
})
export class TPAClaimsComponentModule {}
