import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {BenefitsListComponent} from './benefits-list.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [BenefitsListComponent],
  exports: [BenefitsListComponent],
})
export class BenefitsListComponentModule {}
