import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BenefitsBannerComponent} from './benefits-banner.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [BenefitsBannerComponent],
  exports: [BenefitsBannerComponent],
})
export class BenefitsBannerModule {}
