import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {BenefitsBannerComponent} from './modal/component/benefits-banner/benefits-banner.component';
import {NudgeComponent} from './modal/nudge/nudge.component';
import {BeforeStartingComponent} from './modal/before-starting/before-starting.component';
import {BenefitsSelectionModalComponent} from './modal/modal.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    BenefitsBannerComponent,
    BenefitsSelectionModalComponent,
    NudgeComponent,
    BeforeStartingComponent,
  ],
  exports: [BenefitsBannerComponent],
})
export class BenefitsSelectModule {}
