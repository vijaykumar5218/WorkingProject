import {AddPlanCardComponent} from './../add-plan-card/add-plan-card.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AddBenefitsPageRoutingModule} from './add-benefits-routing.module';

import {AddBenefitsPage} from './add-benefits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBenefitsPageRoutingModule,
  ],
  declarations: [AddBenefitsPage, AddPlanCardComponent],
})
export class AddBenefitsPageModule {}
