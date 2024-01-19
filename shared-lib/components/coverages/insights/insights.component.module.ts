import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {InsightsComponent} from './insights.component';
import {ConsentRequiredComponentModule} from '@shared-lib/components/coverages/consent-required/consent-required.module';
import {InsightsPageRoutingModule} from './insights-routing.module';
import {MedDisclaimerModule} from '../med-disclaimer/med-disclaimer.module';
import {LoadingComponentModule} from '@shared-lib/components/loading/loading.module';
import {ScreeningNudgeComponent} from './components/screening-nudge/screening-nudge.component';
import {HSAStoreNudgeComponentModule} from '@shared-lib/components/hsastore-nudge/hsastore-nudge.module';
import {GotConsentComponentModule} from '@shared-lib/components/got-consent/got-consent.module';
import {BSTSmartCardModule} from '@shared-lib/components/coverages/bst-smart-card/bstsmart-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsentRequiredComponentModule,
    InsightsPageRoutingModule,
    MedDisclaimerModule,
    LoadingComponentModule,
    HSAStoreNudgeComponentModule,
    GotConsentComponentModule,
    BSTSmartCardModule,
  ],
  declarations: [InsightsComponent, ScreeningNudgeComponent],
  exports: [InsightsComponent],
})
export class InsightsComponentModule {}
