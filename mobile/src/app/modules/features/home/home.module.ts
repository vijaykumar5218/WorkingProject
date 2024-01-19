import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {HomePageRoutingModule} from './home-routing.module';
import {HomePage} from './home.page';
import {JourneysModule} from '@shared-lib/modules/journeys/journeys.module';
import {BenefitsSelectModule} from '../../../../../../shared-lib/components/benefits-selection/benefits-selection.module';
import {StatusModule} from '@shared-lib/modules/journeys/components/status/status.module';
import {NetWorthModule} from '@shared-lib/components/net-worth/net-worth.module';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {MedicalSpendingModule} from '@shared-lib/components/home/medical-spending/medical-spending.module';
import {MXErrorComponentModule} from '@shared-lib/components/mx-error/mxerror.module';
import { PreferenceSelectionModule } from '@shared-lib/modules/preferences-selection/preferences-selection.module';
import {PlansPageModule} from '@shared-lib/components/coverages/plans/plans.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MXWidgetModule,
    HomePageRoutingModule,
    BenefitsSelectModule,
    StatusModule,
    NetWorthModule,
    JourneysModule,
    MedicalSpendingModule,
    MXErrorComponentModule,
    PreferenceSelectionModule,
    PlansPageModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
