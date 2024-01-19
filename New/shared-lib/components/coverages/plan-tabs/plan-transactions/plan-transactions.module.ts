import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PlanTransactionsPageRoutingModule} from './plan-transactions-routing.module';
import {PlanTransactionsComponentModule} from './plan-transactions-component.module';
import {FilterPopoverModule} from '../../../filter-popover/filter-popover.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanTransactionsPageRoutingModule,
    PlanTransactionsComponentModule,
    FilterPopoverModule,
  ],
  declarations: [],
  exports: [],
})
export class PlanTransactionsModule {}
