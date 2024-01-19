import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PlanTabsPageRoutingModule} from './plan-tabs-routing.module';
import {PlanTransactionsModule} from '@shared-lib/components/coverages/plan-tabs/plan-transactions/plan-transactions.module';
import {PlanTabsPage} from './plan-tabs.page';
import {AsOfComponentModule} from '@shared-lib/components/coverages/plan-tabs/plan-details/as-of/as-of.module';
import {PlanDetailsModule} from '@shared-lib/components/coverages/plan-tabs/plan-details/plan-details.module';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {ConsentRequiredComponentModule} from '@shared-lib/components/coverages/consent-required/consent-required.module';
import {DependentsComponentModule} from '@shared-lib/components/coverages/plan-tabs/plan-details/dependents/dependents.module';
import {CovExplanationsModule} from '@shared-lib/components/coverages/plan-tabs/plan-details/cov-explanations/cov-explanations.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanTabsPageRoutingModule,
    LoadingTextComponentModule,
    PlanDetailsModule,
    AsOfComponentModule,
    ConsentRequiredComponentModule,
    PlanTransactionsModule,
    DependentsComponentModule,
    CovExplanationsModule,
  ],
  declarations: [PlanTabsPage],
})
export class PlanTabsPageModule {}
