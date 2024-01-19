import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {CoverageTabsPageRoutingModule} from './coverage-tabs-routing.module';
import {CoverageTabsPage} from './coverage-tabs.page';
import {NoBenefitsComponentModule} from '@shared-lib/components/coverages/benefit-elections/no-benefits/no-benefits.module';
import {InfoModalComponent} from '@shared-lib/components/coverages/insights/info-modal/info-modal.component';
import {InsightsComponentModule} from '@shared-lib/components/coverages/insights/insights.component.module';
import {TPAClaimsComponentModule} from '@shared-lib/components/coverages/tpaclaims/tpaclaims.component.module';
import {ConsentRequiredComponentModule} from '@shared-lib/components/coverages/consent-required/consent-required.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoverageTabsPageRoutingModule,
    NoBenefitsComponentModule,
    ConsentRequiredComponentModule,
    InsightsComponentModule,
    TPAClaimsComponentModule,
  ],
  declarations: [CoverageTabsPage, InfoModalComponent],
  exports: [InfoModalComponent],
  providers: [],
})
export class CoverageTabsPageModule {}
