import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HomePage} from './home.page';
import {HomePageRoutingModule} from './home-routing.module';
import {BenefitsSelectModule} from '@shared-lib/components/benefits-selection/benefits-selection.module';
import {NetWorthModule} from '@shared-lib/components/net-worth/net-worth.module';
import {FooterModuleDesktop} from '../../shared/components/footer/footer.module';
import {MedicalSpendingModule} from '@shared-lib/components/home/medical-spending/medical-spending.module';
import {MXWidgetModule} from '@shared-lib/components/mx-widget/mx-widget.module';
import {NetWorthPageModule} from '../net-worth/net-worth.page.module';
import {MXErrorComponentModule} from '@shared-lib/components/mx-error/mxerror.module';
import {LoadingTextComponentModule} from '@shared-lib/components/loading-text/loading-text.module';
import {RecommendedJourneyModule} from '../../shared/components/recommended-journey/recommended-journey.module';
import {PreferenceSelectionModule} from '@shared-lib/modules/preferences-selection/preferences-selection.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    BenefitsSelectModule,
    NetWorthModule,
    FooterModuleDesktop,
    MedicalSpendingModule,
    MXWidgetModule,
    NetWorthPageModule,
    MXErrorComponentModule,
    LoadingTextComponentModule,
    RecommendedJourneyModule,
    PreferenceSelectionModule,
  ],
  declarations: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
