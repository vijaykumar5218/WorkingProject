import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {NoBenefitsComponent} from './no-benefits.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [NoBenefitsComponent],
  exports: [NoBenefitsComponent],
})
export class NoBenefitsComponentModule {}
