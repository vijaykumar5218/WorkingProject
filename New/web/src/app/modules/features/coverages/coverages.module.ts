import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CoveragesPage} from './coverages.page';
import {CoveragesRoutingModule} from './coverages-routing.module';
import {FooterModuleDesktop} from '@web/app/modules/shared/components/footer/footer.module';
import {SubHeaderComponentModule} from '../../shared/components/sub-header/sub-header.module';
import {PlansPageModule} from '@shared-lib/components/coverages/plans/plans.module';
import {BSTSmartCardModule} from '@shared-lib/components/coverages/bst-smart-card/bstsmart-card.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoveragesRoutingModule,
    FooterModuleDesktop,
    SubHeaderComponentModule,
    PlansPageModule,
    BSTSmartCardModule,
  ],
  declarations: [CoveragesPage],
})
export class CoveragesPageModule {}
