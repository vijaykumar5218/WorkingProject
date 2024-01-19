import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PlanDetailsPageRoutingModule} from './plan-details-routing.module';
import {PlanDetailsComponent} from './plan-details.component';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {AsOfComponentModule} from './as-of/as-of.module';
import {DependentsComponentModule} from './dependents/dependents.module';
import {CovExplanationsModule} from './cov-explanations/cov-explanations.module';
import {MedDisclaimerModule} from '../../med-disclaimer/med-disclaimer.module';
import {MyIdCardModule} from '../plan-details/my-id-card/my-id-card.module';
import {AddCardComponent} from './add-card/add-card.component';
import {CardComponent} from './add-card/card/card.component';
import {CovExtraDetailsModule} from './cov-extra-details/cov-extra-details.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanDetailsPageRoutingModule,
    LoadingTextComponentModule,
    AsOfComponentModule,
    DependentsComponentModule,
    CovExplanationsModule,
    MedDisclaimerModule,
    MyIdCardModule,
    CovExtraDetailsModule,
  ],
  declarations: [PlanDetailsComponent, AddCardComponent, CardComponent],
  exports: [PlanDetailsComponent],
})
export class PlanDetailsModule {}
